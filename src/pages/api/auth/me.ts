/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    const payload = await verifyToken(token);

    if (!payload) {
        return res.status(401).json({ message: "Invalid token" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: payload.id as string },
            select: { id: true, name: true, email: true },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
