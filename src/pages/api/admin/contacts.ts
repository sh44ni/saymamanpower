import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdminAuth } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const admin = await requireAdminAuth(req, res);
    if (!admin) return; // Response already sent by requireAdminAuth

    if (req.method === "GET") {
        try {
            const contacts = await prisma.contactForm.findMany({
                orderBy: { createdAt: "desc" },
            });
            return res.status(200).json(contacts);
        } catch (error: any) {
            console.error("Error fetching contacts:", error);
            return res.status(500).json({ error: "Failed to fetch contacts" });
        }
    }

    if (req.method === "DELETE") {
        try {
            const { id } = req.query;
            await prisma.contactForm.delete({
                where: { id: id as string },
            });
            return res.status(200).json({ success: true });
        } catch (error: any) {
            console.error("Error deleting contact:", error);
            return res.status(500).json({ error: "Failed to delete contact" });
        }
    }

    if (req.method === "PATCH") {
        try {
            const { id } = req.query;
            const { status } = req.body;
            const contact = await prisma.contactForm.update({
                where: { id: id as string },
                data: { status },
            });
            return res.status(200).json(contact);
        } catch (error: any) {
            console.error("Error updating contact:", error);
            return res.status(500).json({ error: "Failed to update contact" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
