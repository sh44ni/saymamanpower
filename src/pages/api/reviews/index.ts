import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { prisma } from "@/lib/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);

    if (req.method === "GET") {
        try {
            const { maidId } = req.query;

            const where: any = { hidden: false };
            if (maidId) {
                where.maidId = maidId as string;
            } else {
                // For general reviews (maidId not provided), we want reviews where maidId is null
                // BUT wait, currently the homepage fetches ALL reviews if no maidId is passed?
                // Let's check logic: `const where = maidId ? { maidId: maidId as string } : {};`
                // If no maidId (homepage), it fetches ALL reviews (general + maid specific).
                // If we want homepage to show general + maid reviews is fine, or just general?
                // Typically homepage testimonials might be mix.
                // But previously it was `const where = maidId ? { maidId: maidId as string } : {};`
                // So it was all reviews.
                // Just add `hidden: false` to it.
            }

            const reviews = await prisma.review.findMany({
                where,
                include: {
                    user: {
                        select: {
                            name: true,
                            image: true,
                        },
                    },
                    maid: {
                        select: {
                            name: true,
                            nameAr: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            return res.status(200).json(reviews);
        } catch (error) {
            console.error("Get reviews error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    if (req.method === "POST") {
        if (!session) {
            return res.status(401).json({ message: "You must be logged in to submit a review" });
        }

        try {
            const { maidId, rating, comment } = req.body;

            // maidId is optional now for general reviews

            if (!rating) {
                return res.status(400).json({ message: "Rating is required" });
            }

            if (rating < 1 || rating > 5) {
                return res.status(400).json({ message: "Rating must be between 1 and 5" });
            }

            if (comment && comment.length > 500) {
                return res.status(400).json({ message: "Comment must be 500 characters or less" });
            }

            // Check if user already reviewed this maid (or left a general review)
            const whereClause = maidId
                ? { userId_maidId: { userId: session.user.id, maidId } }
                : { userId: session.user.id, maidId: null };

            // For general reviews, we can't use the unique constraint directly if it's [userId, maidId] and maidId is null (depending on DB).
            // However, let's just use findFirst to be safe for general reviews.

            const existingReview = await prisma.review.findFirst({
                where: {
                    userId: session.user.id,
                    maidId: maidId || null,
                },
            });

            if (existingReview) {
                return res.status(400).json({
                    message: maidId ? "You have already reviewed this maid" : "You have already submitted a general review"
                });
            }

            // Create review
            const reviewData: any = {
                userId: session.user.id,
                rating,
                comment: comment || null,
            };

            if (maidId) {
                reviewData.maidId = maidId;
            }

            const review = await prisma.review.create({
                data: reviewData,
                include: {
                    user: {
                        select: {
                            name: true,
                            image: true,
                        },
                    },
                },
            });

            return res.status(201).json(review);
        } catch (error: any) {
            console.error("Create review error:", error);
            return res.status(500).json({ message: error.message || "Internal server error" });
        }
    }

    return res.status(405).json({ message: "Method not allowed" });
}
