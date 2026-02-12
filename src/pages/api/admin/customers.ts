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
                            maid: true // Simplified from nested select
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
            console.error("Detailed error fetching customers:", {
                message: error instanceof Error ? error.message : "Unknown error",
                stack: error instanceof Error ? error.stack : undefined,
                error
            });
            return res.status(500).json({
                error: "Internal Server Error",
                details: error instanceof Error ? error.message : "Possible database connection issue or schema mismatch"
            });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
