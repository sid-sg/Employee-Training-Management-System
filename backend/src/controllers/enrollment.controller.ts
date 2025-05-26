import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../prisma/client';

export const rateTraining = async (req: AuthRequest, res: Response) : Promise<void> => {
    const { id } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 0 || rating > 5) {
        res.status(400).json({ error: 'Rating must be between 0 and 5' });
        return;
    }

    try {
        const enrollment = await prisma.trainingEnrollment.update({
            where: { id },
            data: { rating },
        });

        res.json({ message: 'Rating submitted successfully', enrollment });
    } catch (error) {
        console.error('Error rating training:', error);
        res.status(500).json({ error: 'Failed to submit rating' });
    }
};
