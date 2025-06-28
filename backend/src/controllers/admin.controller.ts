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
                const { name, employeeid, email, phonenumber, department } = row;

                if (!name || !employeeid || !email || !department) {
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
                        employeeid,
                        email,
                        phonenumber,
                        department,
                        role: role,
                        password: hashed,
                    },
                });

                createdUsers.push({ email, password });
            }

            if (!req.file) {
                return res.status(400).json({ error: 'CSV file required or invalid file type/size exceeded' });
            }

            if (req.file) {
                fs.unlinkSync(req.file.path);
            }

            for (const user of createdUsers) {
                try {
                    await sendEmail(user.email, "Welcome to the Training Portal", onboardingTemplate(user.name, user.email, user.password));
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

const createSingleUser = async (req: Request, res: Response, role: 'EMPLOYEE' | 'HR_ADMIN'): Promise<any> => {
    const { name, employeeid, email, phonenumber, department } = req.body;

    // Validate required fields
    if (!name || !employeeid || !email || !department) {
        return res.status(400).json({ error: 'Missing required fields: name, employeeid, email, department' });
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { employeeid }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({
                error: existingUser.email === email
                    ? 'User with this email already exists'
                    : 'User with this employee ID already exists'
            });
        }

        // Generate password and hash it
        const password = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await prisma.user.create({
            data: {
                name,
                employeeid,
                email,
                phonenumber: phonenumber || null,
                department,
                role: role,
                password: hashedPassword,
            },
        });

        // Send welcome email with credentials
        try {
            await sendEmail(email, "Welcome to the Training Portal", onboardingTemplate(name, email, password));
        } catch (err) {
            console.error(`Failed to send email to ${email}:`, err);
            // Don't fail the request if email fails, but log it
        }

        res.status(201).json({
            message: `${role === 'EMPLOYEE' ? 'Employee' : 'HR Admin'} created successfully`,
            user: {
                id: newUser.id,
                name: newUser.name,
                employeeid: newUser.employeeid,
                email: newUser.email,
                department: newUser.department,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

export const uploadEmployees = async (req: Request, res: Response): Promise<any> => {
    // Check if this is a CSV upload or single user creation
    if (req.file) {
        // CSV upload
        await handleCSVUpload(req, res, 'EMPLOYEE');
    } else {
        // Single user creation
        await createSingleUser(req, res, 'EMPLOYEE');
    }
};

export const uploadHRAdmins = async (req: Request, res: Response): Promise<any> => {
    // Check if this is a CSV upload or single user creation
    if (req.file) {
        // CSV upload
        await handleCSVUpload(req, res, 'HR_ADMIN');
    } else {
        // Single user creation
        await createSingleUser(req, res, 'HR_ADMIN');
    }
};
