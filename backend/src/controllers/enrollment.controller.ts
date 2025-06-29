import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../prisma/client';
import { TrainingRatingRequest, UserIdParams } from '../validations/employee.validation';

// Note: This function is commented out because the 'rating' field doesn't exist in the TrainingEnrollment model
// If rating functionality is needed, the Prisma schema should be updated to include a rating field
/*
export const rateTraining = async (req: AuthRequest & { body: TrainingRatingRequest, params: UserIdParams }, res: Response) : Promise<void> => {
    const { id } = req.params;
    const { rating } = req.body;

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
*/
