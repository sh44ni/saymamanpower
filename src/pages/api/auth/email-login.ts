import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
            include: { accounts: true },
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check if user has a password (not OAuth-only)
        const passwordAccount = user.accounts.find(acc => acc.provider === "credentials");

        if (!passwordAccount) {
            return res.status(401).json({ message: "Please sign in with Google" });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, passwordAccount.providerAccountId); // Stored in providerAccountId for credentials

        if (!isValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                hasPhone: !!user.phone,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
