const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    const email = "saymamanpowerom@gmail.com";

    console.log(`Seeding admin user: ${email}`);

    const admin = await prisma.admin.upsert({
        where: { email },
        update: {},
        create: {
            email,
        },
    });

    console.log("Admin user seeded:", admin);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
