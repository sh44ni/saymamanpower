import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdminAuth } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await requireAdminAuth(req, res);
    if (!session) return;

    // Cast session to any to avoid strict type checks for now, or define a type
    const adminUser = session as any;

    if (req.method === "GET") {
        try {
            const emails = await prisma.authorizedEmail.findMany({
                orderBy: { createdAt: "desc" },
            });
            return res.status(200).json(emails);
        } catch (error: any) {
            console.error("Error fetching authorized emails:", {
                message: error.message,
                stack: error.stack,
                error
            });
            return res.status(500).json({
                error: "Failed to fetch authorized emails",
                details: error.message
            });
        }
    }

    if (req.method === "POST") {
        try {
            const { email } = req.body;

            if (!email || !email.includes("@")) {
                return res.status(400).json({ error: "Invalid email address" });
            }

            const authorizedEmail = await prisma.authorizedEmail.create({
                data: {
                    email: email.toLowerCase(),
                    addedBy: adminUser.email || null,
                },
            });

            return res.status(201).json(authorizedEmail);
        } catch (error: any) {
            if (error.code === "P2002") {
                return res.status(400).json({ error: "Email already authorized" });
            }
            console.error("Error creating authorized email:", error);
            return res.status(500).json({ error: "Failed to authorize email" });
        }
    }

    if (req.method === "DELETE") {
        try {
            const { id } = req.query;
            await prisma.authorizedEmail.delete({
                where: { id: id as string },
            });
            return res.status(200).json({ success: true });
        } catch (error: any) {
            console.error("Error deleting authorized email:", error);
            return res.status(500).json({ error: "Failed to delete authorized email" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
