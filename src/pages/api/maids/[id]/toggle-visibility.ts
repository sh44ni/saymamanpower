/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";
import { prisma } from "@/lib/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "PATCH") {
        try {
            const { id } = req.query;

            const maid = await prisma.maid.findUnique({
                where: { id: id as string },
            });

            if (!maid) {
                return res.status(404).json({ error: "Maid not found" });
            }

            const updatedMaid = await prisma.maid.update({
                where: { id: id as string },
                data: { hidden: !maid.hidden },
            });

            return res.status(200).json(updatedMaid);
        } catch (error: any) {
            console.error("Error toggling maid visibility:", error);
            return res.status(500).json({ error: "Failed to toggle visibility" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
