import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "@/lib/auth";
import { parse } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

    const cookies = parse(req.headers.cookie || "");
    const token = cookies.admin_token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = await verifyToken(token);

    if (!payload) {
        return res.status(401).json({ message: "Invalid token" });
    }

    res.status(200).json({ user: payload });
}
