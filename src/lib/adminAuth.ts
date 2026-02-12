import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { verifyToken } from "@/lib/auth";

export async function isAuthenticatedAdmin(req: NextApiRequest, res: NextApiResponse) {
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.admin_token;

    if (!token) {
        return null;
    }

    const payload = await verifyToken(token);
    return payload; // Returns user object or null
}

export async function requireAdminAuth(req: NextApiRequest, res: NextApiResponse) {
    const user = await isAuthenticatedAdmin(req, res);
    if (!user) {
        res.status(401).json({ message: "Unauthorized: Admin access required" });
        return null;
    }
    return user;
}
