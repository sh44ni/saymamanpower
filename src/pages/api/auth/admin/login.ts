import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { generateOTP } from "@/lib/auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
        // 1. Check if email is authorized
        const isAuthorized = await prisma.authorizedEmail.findUnique({
            where: { email },
        });

        if (!isAuthorized) {
            console.log(`[Admin Login BLOCK] Unauthorized access attempt: ${email}`);
            return res.status(403).json({ message: "AccessDenied" });
        }

        // 2. Generate OTP
        const otp = generateOTP(); // Ensure this function returns a 6-digit string
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // 3. Upsert Admin (Only if authorized)
        await prisma.admin.upsert({
            where: { email },
            update: { otp, otpExpires },
            create: { email, otp, otpExpires },
        });

        console.log(`[Admin Login] Sending OTP to ${email}...`);

        // 4. Send Email via Resend
        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev", // Change this to your verified domain in production
            to: email,
            subject: "Your Sayma Manpower Admin OTP",
            html: `<p>Your OTP code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`,
        });

        if (error) {
            console.error("[Admin Login] Resend API Error:", JSON.stringify(error, null, 2));
            return res.status(500).json({ message: "Failed to send email", error: error.message });
        }

        console.log(`[Admin Login] Email sent successfully. ID: ${data?.id}`);
        res.status(200).json({ message: "OTP sent successfully" });

    } catch (error: any) {
        console.error("[Admin Login] Unexpected Error:", error);
        res.status(500).json({ message: "Internal server error", debug: error.message });
    }
}
