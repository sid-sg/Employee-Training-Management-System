import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const getStatistics = async (req: Request, res: Response): Promise<void> => {
    try {
        const [employeeCount, hrAdminCount, activeTrainingsCount] = await Promise.all([
            prisma.user.count({
                where: { role: 'EMPLOYEE' }
            }),
            prisma.user.count({
                where: { role: 'HR_ADMIN' }
            }),
            prisma.training.count({
                where: {
                    endDate: {
                        gte: new Date()
                    }
                }
            })
        ]);

        res.json({
            totalEmployees: employeeCount,
            totalHRAdmins: hrAdminCount,
            totalActiveTrainings: activeTrainingsCount
        });
    } catch (err) {
        console.error('Error fetching statistics:', err);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};
