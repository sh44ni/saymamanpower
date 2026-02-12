/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";


const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "fallbacksecret");

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
}

export async function signToken(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(SECRET_KEY);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload;
    } catch (error) {
        return null;
    }
}

export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
