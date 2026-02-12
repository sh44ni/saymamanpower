/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    debug: process.env.NODE_ENV === "development",
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    include: { accounts: true },
                });

                if (!user) {
                    return null;
                }

                const credentialsAccount = user.accounts.find(
                    (acc) => acc.provider === "credentials"
                );

                if (!credentialsAccount) {
                    return null;
                }

                const isValid = await bcrypt.compare(
                    credentials.password,
                    credentialsAccount.providerAccountId
                );

                if (!isValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                };
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            console.log("SignIn Callback:", { user, account, profile });
            if (!user.email) {
                console.error("SignIn failed: No email in user object");
                return false;
            }

            // Check if this is an admin trying to log in
            try {
                const authorizedEmail = await prisma.authorizedEmail.findUnique({
                    where: { email: user.email },
                });

                // If authorized email exists, this is an admin login
                if (authorizedEmail) {
                    console.log("Admin login detected for:", user.email);
                    // Update or create admin record
                    if (account?.provider === "google") {
                        await prisma.admin.upsert({
                            where: { email: user.email },
                            update: {
                                name: user.name,
                                picture: user.image,
                                googleId: account.providerAccountId,
                                lastLoginAt: new Date(),
                            },
                            create: {
                                email: user.email,
                                name: user.name,
                                picture: user.image,
                                googleId: account.providerAccountId,
                                lastLoginAt: new Date(),
                            },
                        });
                    }
                    return true;
                }

                // Otherwise, this is a regular user login
                // User will be created automatically by PrismaAdapter
                console.log("Regular user login for:", user.email);
                return true;
            } catch (error) {
                console.error("Error in signIn callback:", error);
                return false;
            }
        },
        async session({ session, user, token }) {
            console.log("Session Callback:", { session, user, token });
            if (session.user && user) {
                // Ensure user.id is available
                if (user.id) {
                    session.user.id = user.id;

                    // Add phone status to session for redirect logic
                    try {
                        const dbUser = await prisma.user.findUnique({
                            where: { id: user.id },
                            select: { phone: true },
                        });
                        (session.user as any).hasPhone = !!dbUser?.phone;

                        // Check if user is an admin
                        if (user.email) {
                            const authorizedEmail = await prisma.authorizedEmail.findUnique({
                                where: { email: user.email },
                            });
                            session.user.isAdmin = !!authorizedEmail;
                        }

                    } catch (error) {
                        console.error("Error fetching user data in session callback:", error);
                    }
                }
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "database",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

