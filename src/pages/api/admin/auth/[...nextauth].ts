import NextAuth, { NextAuthOptions } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { prisma } from "@/lib/prisma";

// We need to override 'cookies' and 'callbacks' for strict admin separation
const adminAuthOptions: NextAuthOptions = {
    ...authOptions,
    callbacks: {
        async signIn({ user, account, profile }) {
            console.log("[AdminAuth] SignIn request:", { email: user.email, name: user.name });

            if (!user.email) {
                console.error("[AdminAuth] SignIn failed: No email provided");
                return false;
            }

            try {
                // Direct prisma call to verify admin status
                const authorized = await prisma.authorizedEmail.findUnique({
                    where: { email: user.email },
                });

                if (!authorized) {
                    console.warn(`[AdminAuth] Access Denied: ${user.email} is not in AuthorizedEmail list.`);
                    return false; // This triggers "AccessDenied" error on client
                }

                console.log(`[AdminAuth] Access Granted for ${user.email}`);



                return true;
            } catch (error) {
                console.error("[AdminAuth] SignIn Error:", error);
                return false;
            }
        },
        async session({ session, user, token }) {
            // Admin session is always admin if they passed signIn
            if (session?.user && user) {
                session.user.id = user.id;
                (session.user as any).isAdmin = true;
            }
            return session;
        }
    },
    cookies: {
        sessionToken: {
            name: `next-auth.admin-session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
        callbackUrl: {
            name: `next-auth.admin-callback-url`,
            options: {
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
        csrfToken: {
            name: `next-auth.admin-csrf-token`,
            options: {
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
        pkceCodeVerifier: {
            name: `next-auth.admin-pkce.code_verifier`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
        state: {
            name: `next-auth.admin-state`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
                maxAge: 900,
            },
        },
        nonce: {
            name: `next-auth.admin-nonce`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
};

export default NextAuth(adminAuthOptions);
