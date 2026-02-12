import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const email = "teamssgesportsoffical@gmail.com";

    try {
        const authorized = await prisma.authorizedEmail.upsert({
            where: { email },
            update: {},
            create: {
                email,
                addedBy: "System Script",
            },
        });
        console.log(`Successfully authorized: ${authorized.email}`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
