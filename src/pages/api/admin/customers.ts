import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdminAuth } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const admin = await requireAdminAuth(req, res);
    if (!admin) return;

    if (req.method === "GET") {
        try {
            const users = await prisma.user.findMany({
                include: {
                    reviews: {
                        orderBy: { createdAt: "desc" },
                        include: {
                            maid: {
                                select: { name: true, nameAr: true } // context for the review
                            }
                        }
                    },
                    _count: {
                        select: { reviews: true },
                    },
                },
                orderBy: { createdAt: "desc" },
            });
            return res.status(200).json(users);
        } catch (error) {
            console.error("Failed to fetch customers:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
