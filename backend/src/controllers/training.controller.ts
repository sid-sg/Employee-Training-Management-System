import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

export const createTraining = async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.body) {
        res.status(400).json({ error: 'Request body is required' });
        return;
    }
    const { title, description, mode, location, startDate, endDate } = req.body;

    if (!title || !description || !mode || !startDate || !endDate) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    if (mode === 'OFFLINE' && !location) {
        res.status(400).json({ error: 'Location is required for offline trainings' });
        return;
    }

    try {
        const training = await prisma.training.create({
            data: {
                title,
                description,
                mode,
                location,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                createdById: req.user!.userId,
            },
        });

        res.status(201).json({ message: 'Training created successfully', training });
    } catch (error) {
        console.error('Error creating training:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateTraining = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ error: 'Training ID is required' });
        return;
    }

    const { title, description, mode, location, startDate, endDate } = req.body;

    if (mode === 'OFFLINE' && !location) {
        res.status(400).json({ error: 'Location is required for offline trainings' });
        return;
    }

    try {
        const existing = await prisma.training.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ error: 'Training not found' });
            return;
        }

        const updated = await prisma.training.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(description && { description }),
                ...(mode && { mode }),
                ...(location && { location }),
                ...(startDate && { startDate: new Date(startDate) }),
                ...(endDate && { endDate: new Date(endDate) }),
            },
        });

        res.status(200).json({ message: 'Training updated successfully', training: updated });
    } catch (error) {
        console.error('Error updating training:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteTraining = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ error: 'Training ID is required' });
        return;
    }

    try {
        const existing = await prisma.training.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ error: 'Training not found' });
            return;
        }

        await prisma.training.delete({ where: { id } });

        res.status(200).json({ message: 'Training deleted successfully' });
    } catch (error) {
        console.error('Error deleting training:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const getAllTrainings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const trainings = await prisma.training.findMany({
            where: {
                createdById: req.user!.userId,
            },
            select: {
                id: true,
                title: true,
                mode: true,
                location: true,
                startDate: true,
                endDate: true,
                createdAt: true,
            },

            orderBy: {
                createdAt: 'desc',
            },
        });

        res.status(200).json({ trainings });
    } catch (error) {
        console.error('Error fetching created trainings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};


export const getTraining = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const training = await prisma.training.findMany({
            where: {
                id,
            }
        });

        res.status(200).json({ training });
    } catch (error) {
        console.error('Error fetching created training:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};

export const getEnrolledTrainings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const trainings = await prisma.trainingEnrollment.findMany({
            where: {
                employeeId: req.user!.userId,
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

export const enrollUsersInTraining = async (req: AuthRequest, res: Response): Promise<void> => {
    const { trainingId } = req.params;
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
        res.status(400).json({ error: 'userIds must be a non-empty array' });
        return;
    }

    try {
        const enrollments = await Promise.all(
            userIds.map(userId =>
                prisma.trainingEnrollment.upsert({
                    where: {
                        employeeId_trainingId: { employeeId: userId, trainingId },
                    },
                    update: {},
                    create: {
                        employeeId: userId,
                        trainingId,
                    },
                })
            )
        );

        res.status(201).json({ message: 'Users enrolled successfully', enrollments });
    } catch (error) {
        console.error('Error enrolling users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
