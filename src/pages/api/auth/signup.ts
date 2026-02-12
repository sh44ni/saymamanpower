/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";
import { serialize } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    const { name, email, password } = req.body;

    if (!email || !password || password.length < 6) {
        return res.status(400).json({ message: "Invalid input" });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });

        const token = await signToken({ id: user.id, email: user.email, role: "user" });

        res.setHeader(
            "Set-Cookie",
            serialize("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: "/",
            })
        );

        res.status(201).json({ message: "User created" });
    } catch (error) {
        res.status(500).json({ message: "Error creating user" });
    }
}
