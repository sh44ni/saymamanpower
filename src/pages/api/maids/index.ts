/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const { includeHidden } = req.query;

            const maids = await prisma.maid.findMany({
                where: includeHidden === "true" ? {} : { hidden: false },
                orderBy: { createdAt: "desc" },
            });
            res.status(200).json(maids);
        } catch (error) {
            res.status(500).json({ message: "Error fetching maids" });
        }
    } else if (req.method === "POST") {
        const { requireAdminAuth } = await import("@/lib/adminAuth");
        const admin = await requireAdminAuth(req, res);
        if (!admin) return;

        try {
            const maid = await prisma.maid.create({
                data: req.body, // In production, add validation (zod)
            });
            res.status(201).json(maid);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error creating maid" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
