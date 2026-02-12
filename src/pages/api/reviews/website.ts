import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        // Get latest reviews for homepage display
        const reviews = await prisma.review.findMany({
            take: 5,
            orderBy: {
                createdAt: "desc",
            },
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
        });

        // Get review statistics
        const stats = await prisma.review.aggregate({
            _avg: {
                rating: true,
            },
            _count: {
                id: true,
            },
        });

        return res.status(200).json({
            reviews,
            stats: {
                averageRating: stats._avg.rating || 0,
                totalReviews: stats._count.id || 0,
            },
        });
    } catch (error) {
        console.error("Get website reviews error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
