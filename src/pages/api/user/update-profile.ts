import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user?.email) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { phone } = req.body;

    if (!phone || typeof phone !== "string" || phone.length < 8) {
        return res.status(400).json({ message: "Valid phone number is required" });
    }

    try {
        const user = await prisma.user.update({
            where: { email: session.user.email },
            data: { phone },
        });

        return res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
