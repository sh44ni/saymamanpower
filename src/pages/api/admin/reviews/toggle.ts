import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdminAuth } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const admin = await requireAdminAuth(req, res);
    if (!admin) return;

    if (req.method === "PUT") {
        const { id, hidden } = req.body;

        if (!id || typeof hidden !== "boolean") {
            return res.status(400).json({ error: "Invalid request" });
        }

        try {
            const review = await prisma.review.update({
                where: { id },
                data: { hidden },
            });
            return res.status(200).json(review);
        } catch (error) {
            console.error("Failed to update review:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
