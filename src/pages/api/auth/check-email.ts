import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        return res.status(200).json({ exists: !!user });
    } catch (error) {
        console.error("Check email error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
