/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { serialize } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    const { email, otp } = req.body;

    try {
        console.log("Verifying OTP for:", email, "OTP:", otp);
        const admin = await prisma.admin.findUnique({ where: { email } });

        console.log("Admin found:", admin);

        if (!admin || !admin.otp || !admin.otpExpires) {
            console.log("Invalid request: Admin or OTP/Expires missing");
            return res.status(400).json({ message: "Invalid request" });
        }

        if (admin.otp !== otp) {
            console.log("Invalid OTP. Expected:", admin.otp, "Received:", otp);
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (new Date() > admin.otpExpires) {
            console.log("OTP expired");
            return res.status(400).json({ message: "OTP expired" });
        }

        // Clear OTP
        await prisma.admin.update({
            where: { email },
            data: { otp: null, otpExpires: null },
        });

        // Generate Token
        const token = await signToken({ id: admin.id, email: admin.email, role: "admin" });

        // Set Cookie
        res.setHeader(
            "Set-Cookie",
            serialize("admin_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 60 * 24, // 1 day
                path: "/",
            })
        );

        console.log("Login successful, token generated");
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error("Verify API Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
