import { Request, Response } from 'express';
import prisma from '../prisma/client';
import bcrypt from 'bcrypt';
// import { Prisma } from '@prisma/client';

interface AuthRequest extends Request {
  user?: { userId: string };
}


enum Role {
  EMPLOYEE,
  HR_ADMIN,
  ADMIN,
}


export const getUser = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        name: true,
        email: true,
        phonenumber: true,
        department: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
    return;
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phonenumber: true,
        role: true,
        department: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
    return;
  } catch (err) {
    console.error("getCurrentUser error:", err);
    res.status(500).json({ message: "Server error" });
    return;
  }
};


export const updatePhoneNumber = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { phonenumber } = req.body;

  if (!phonenumber) {
    res.status(400).json({ error: 'Phone number is required' });
    return;
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { phonenumber: phonenumber },
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
  const userId = req.user?.userId;
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
        ...(role && { role: role as any }),
        ...(department && { department: department as string }),
      },
    });

    res.status(200).json(users);
    return;
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
    return;
  }
};


// export const getEnrolledTrainingsOfUser = async (req: AuthRequest, res: Response): Promise<void> => {
// 	  const { userId } = req.params;

//   try {
// 		const trainings = await prisma.trainingEnrollment.findMany({
// 			where: {
// 				employeeId: userId,
// 			},
// 			include: {
// 				training: true,
// 			},
// 		});

// 		const result = trainings.map((enrollment) => enrollment.training);

// 		res.status(200).json({ trainings: result });
// 	} catch (error) {
// 		console.error('Error fetching enrolled trainings:', error);
// 		res.status(500).json({ error: 'Internal server error' });
// 	}
// };

export const getEnrolledTrainingsOfUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const trainings = await prisma.trainingEnrollment.findMany({
      where: {
        employeeId: userId,
      },
      include: {
        training: true,
      },
    });

    const result = trainings.map((enrollment) => enrollment.training);

    res.status(200).json({ trainings: result });
  } catch (error) {
    console.error('Error fetching enrolled trainings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

