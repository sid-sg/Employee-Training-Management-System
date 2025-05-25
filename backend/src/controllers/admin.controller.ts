import { Request, Response } from 'express';
import fs from 'fs';
import csv from 'csv-parser';
import bcrypt from 'bcrypt';
import prisma from '../prisma/client';
import { sendEmail } from '../mailer/mailer';
import { onboardingTemplate } from '../mailer/templates';

function generateRandomPassword(length = 10): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

const handleCSVUpload = async (req: Request, res: Response, role: 'EMPLOYEE' | 'HR_ADMIN'): Promise<any> => {
    if (!req.file) {
        return res.status(400).json({ error: 'CSV file required' });
    }

    const results: any[] = [];
    const createdUsers: any[] = [];

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            for (const row of results) {
                const { name, email, phonenumber, department } = row;

                if (!name || !email || !department) {
                    console.error('Missing required fields in CSV row:', row);
                    continue;
                }

                const existing = await prisma.user.findUnique({ where: { email } });
                if (existing) {
                    console.error(`User with email ${email} already exists.`);
                    continue;
                }

                const password = generateRandomPassword();
                const hashed = await bcrypt.hash(password, 10);

                await prisma.user.create({
                    data: {
                        name,
                        email,
                        phonenumber,
                        department,
                        role: role,
                        password: hashed,
                    },
                });

                console.log(`Created user ${email} with password: ${password}`);
                createdUsers.push({ email, password });
            }


            if (req.file) {
                fs.unlinkSync(req.file.path);
            }

            for (const user of createdUsers) {
                try {
                    await sendEmail(user.email, "Welcome to the Training Portal", onboardingTemplate(user.email, user.password));
                } catch (err) {
                    console.error(`Failed to send email to ${user.email}:`, err);
                }
            }

            res.json({ message: 'Users processed', createdUsers });
        })
        .on('error', (err) => {
            console.error('CSV processing error:', err);
            res.status(500).json({ error: 'Failed to process CSV file' });
        });
};

export const uploadEmployees = async (req: Request, res: Response): Promise<any> => {
    await handleCSVUpload(req, res, 'EMPLOYEE');
};

export const uploadHRAdmins = async (req: Request, res: Response): Promise<any> => {
    await handleCSVUpload(req, res, 'HR_ADMIN');
};
