import bcrypt from 'bcrypt';
import prisma from '../src/prisma/client';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!existingAdmin) {
        if (!adminEmail) {
            throw new Error('ADMIN_EMAIL is not defined in the environment variables.');
        }
        if (!adminPassword) {
            throw new Error('ADMIN_PASSWORD is not defined in the environment variables.');
        }
        const password = await bcrypt.hash(adminPassword, 10);

        await prisma.user.create({
            data: {
                name: "Admin",
                employeeid: "0",
                email: adminEmail,
                password: password,
                role: 'ADMIN',
                department: 'HQ',
            },
        });

        console.log('Admin created');
    } else {
        console.log('Admin already exists.');
    }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
