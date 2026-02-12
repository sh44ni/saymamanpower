import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2];

    if (!email) {
        console.error("Please provide an email address");
        console.log("Usage: node add-authorized-email.js email@example.com");
        process.exit(1);
    }

    try {
        const authorizedEmail = await prisma.authorizedEmail.create({
            data: {
                email: email.toLowerCase(),
                addedBy: "system",
            },
        });

        console.log("✓ Email authorized successfully:");
        console.log(`  Email: ${authorizedEmail.email}`);
        console.log(`  ID: ${authorizedEmail.id}`);
        console.log("\nYou can now sign in with this email using Google OAuth.");
    } catch (error: any) {
        if (error.code === "P2002") {
            console.error("✗ This email is already authorized");
        } else {
            console.error("✗ Error:", error.message);
        }
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
