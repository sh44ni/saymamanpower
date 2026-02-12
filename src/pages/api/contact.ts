/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        try {
            const { name, phone, email, message } = req.body;

            // Validation
            if (!name || !phone || !message) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            // Save to database
            const contactForm = await prisma.contactForm.create({
                data: {
                    name,
                    phone,
                    email: email || null,
                    message,
                    status: "new",
                },
            });

            return res.status(201).json({
                success: true,
                message: "Contact form submitted successfully",
                data: contactForm,
            });
        } catch (error: any) {
            console.error("Contact form error:", error);
            return res.status(500).json({ error: "Failed to submit contact form" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
