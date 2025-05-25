import { Request, Response } from 'express';
import prisma from '../prisma/client';
import bcrypt from 'bcrypt';

interface AuthRequest extends Request {
    user?: { id: string };
}

export const updatePhoneNumber = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        res.status(400).json({ error: 'Phone number is required' });
        return;
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { phonenumber: phoneNumber },
        });

        res.json({ message: 'Phone number updated successfully' });
        return;
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update phone number' });
        return;
    }
};

export const updatePassword = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        res.status(400).json({ error: 'Both current and new passwords are required' });
        return;
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
            res.status(401).json({ error: 'Current password is incorrect' });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        res.json({ message: 'Password updated successfully' });
        return;
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update password' });
        return;
    }
};
