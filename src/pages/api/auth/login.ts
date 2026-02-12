/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken } from "@/lib/auth";
import { serialize } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) return res.status(400).json({ message: "Invalid credentials" });

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

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
}
