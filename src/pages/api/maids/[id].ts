/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (typeof id !== "string") return res.status(400).json({ message: "Invalid ID" });

    if (req.method === "GET") {
        try {
            const maid = await prisma.maid.findUnique({ where: { id } });
            if (!maid) return res.status(404).json({ message: "Maid not found" });
            res.status(200).json(maid);
        } catch (error) {
            res.status(500).json({ message: "Error fetching maid" });
        }
    } else if (req.method === "PUT") {
        try {
            const maid = await prisma.maid.update({
                where: { id },
                data: req.body,
            });
            res.status(200).json(maid);
        } catch (error) {
            res.status(500).json({ message: "Error updating maid" });
        }
    } else if (req.method === "DELETE") {
        try {
            await prisma.maid.delete({ where: { id } });
            res.status(200).json({ message: "Maid deleted" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting maid" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
