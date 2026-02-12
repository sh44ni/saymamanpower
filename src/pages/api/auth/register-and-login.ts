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
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        // Strict Oman Phone Validation
        const phoneRegex = /^(9|7)\d{7}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: "Invalid Phone Number. Must be an 8-digit Oman number starting with 9 or 7." });
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Check if phone already exists
        const existingPhone = await prisma.user.findUnique({
            where: { phone },
        });

        if (existingPhone) {
            return res.status(400).json({ message: "Phone number already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with credentials account
        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                emailVerified: new Date(),
                accounts: {
                    create: {
                        type: "credentials",
                        provider: "credentials",
                        providerAccountId: hashedPassword, // Store hashed password here
                    },
                },
            },
        });

        return res.status(201).json({
            message: "Account created successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
