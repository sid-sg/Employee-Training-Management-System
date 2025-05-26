import { Request, Response } from 'express';
import prisma from '../prisma/client';
import bcrypt from 'bcrypt';
// import { Prisma } from '@prisma/client';

interface AuthRequest extends Request {
    user?: { id: string };
}


enum Role {
  EMPLOYEE,
  HR_ADMIN,
  ADMIN,
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

export const getUsers = async (req: AuthRequest, res: Response) => {
  const { role, department } = req.query;

  try {
    const users = await prisma.user.findMany({
      where: {
        ...(role && { role: role as any }), // ideally use proper enum type here
        ...(department && { department: department as string }),
      },
    });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
};


export const getEmployees = async (req: AuthRequest, res: Response) => {
  const { department } = req.query;

  try {
    const employees = await prisma.user.findMany({
      where: {
        role: 'EMPLOYEE',
        ...(department && { department: department as string }),
      },
    });

    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Error fetching employees' });
  }
};

