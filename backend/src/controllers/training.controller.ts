import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';
import { sendEmail } from '../../workers/mailer';
import { trainingEnrollmentTemplate } from '../mailer/templates';
import {
    TrainingRequest,
    TrainingUpdateRequest,
    UserEnrollmentRequest,
    TrainingIdParams,
    TrainingIdEnrollmentParams
} from '../validations/training.validation';
import { TrainingFeedbackRequest, TrainingIdFeedbackParams } from '../validations/employee.validation';
import { emailQueue } from '../queues/emailQueue';

const prisma = new PrismaClient();

export const createTraining = async (req: AuthRequest & { body: TrainingRequest }, res: Response): Promise<void> => {
    const { title, description, mode, location, platform, startDate, endDate } = req.body;

    try {
        const training = await prisma.training.create({
            data: {
                title,
                description,
                mode,
                location,
                platform,
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

export const updateTraining = async (req: AuthRequest & { body: TrainingUpdateRequest, params: TrainingIdParams }, res: Response): Promise<void> => {
    const { id } = req.params;
    const { title, description, mode, location, platform, startDate, endDate } = req.body;

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
                ...(platform && { platform }),
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

export const deleteTraining = async (req: AuthRequest & { params: TrainingIdParams }, res: Response): Promise<void> => {
    const { id } = req.params;

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
            select: {
                id: true,
                title: true,
                mode: true,
                location: true,
                platform: true,
                startDate: true,
                endDate: true,
                totalRating: true,
                totalParticipants: true,
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

export const getTraining = async (req: AuthRequest & { params: TrainingIdParams }, res: Response): Promise<void> => {
    const { id } = req.params;
    const { userId, role } = req.user!;

    try {
        // For employees, check if they are enrolled in this training
        if (role === 'EMPLOYEE') {
            const enrollment = await prisma.trainingEnrollment.findUnique({
                where: {
                    employeeId_trainingId: {
                        employeeId: userId,
                        trainingId: id,
                    },
                },
            });

            if (!enrollment) {
                res.status(403).json({ error: 'You are not enrolled in this training' });
                return;
            }
        }

        const training = await prisma.training.findUnique({
            where: {
                id,
            }
        });

        if (!training) {
            res.status(404).json({ error: 'Training not found' });
            return;
        }

        res.status(200).json({ training });
    } catch (error) {
        console.error('Error fetching training:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getEnrolledUsersOfTraining = async (req: AuthRequest & { params: TrainingIdEnrollmentParams }, res: Response): Promise<void> => {
    const { trainingId } = req.params;

    try {
        const enrolledUsers = await prisma.trainingEnrollment.findMany({
            where: { trainingId },
            include: { employee: true }
        });

        res.json({
            users: enrolledUsers.map(({ employee }) => ({
                id: employee.id,
                name: employee.name,
                employeeid: employee.employeeid,
                email: employee.email,
                department: employee.department,
                phone: employee.phonenumber
            }))
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch enrolled users" });
    }
};

export const getAvailableEmployeesForTraining = async (req: AuthRequest & { params: TrainingIdEnrollmentParams }, res: Response): Promise<void> => {
    const { trainingId } = req.params;

    try {
        const enrolledUserIds = await prisma.trainingEnrollment.findMany({
            where: { trainingId },
            select: { employeeId: true }
        });

        const enrolledIds = enrolledUserIds.map(enrollment => enrollment.employeeId);

        const availableEmployees = await prisma.user.findMany({
            where: {
                role: { in: ['EMPLOYEE', 'HR_ADMIN'] },
                id: { notIn: enrolledIds }
            },
            select: {
                id: true,
                name: true,
                employeeid: true,
                email: true,
                department: true,
                phonenumber: true
            }
        });

        res.json({ employees: availableEmployees });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch available employees" });
    }
};

export const enrollUsersInTraining = async (req: AuthRequest & { body: UserEnrollmentRequest, params: TrainingIdEnrollmentParams }, res: Response): Promise<void> => {
    const { trainingId } = req.params;
    const { userIds } = req.body;

    try {
        const training = await prisma.training.findUnique({
            where: { id: trainingId },
        });

        if (!training) {
            res.status(404).json({ error: 'Training not found' });
            return;
        }

        const users = await prisma.user.findMany({
            where: { id: { in: userIds } },
        });

        const enrollments = await Promise.all(
            userIds.map((userId: string) =>
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

        await Promise.allSettled(
            users.map((user) =>
                emailQueue.add(
                    "trainingEnrollmentEmail",
                    {
                        to: user.email,
                        subject: `${training.title} Enrollment`,
                        htmlBody: trainingEnrollmentTemplate( 
                            user.name,
                            training.title,
                            training.mode,
                            training.startDate,
                            training.endDate,
                            training.location || '',
                            training.platform || ''
                        ),
                    },
                    {
                        jobId: `enrollment-${training.id}-${user.id}`,
                        attempts: 3,
                        removeOnComplete: true,
                        removeOnFail: true,
                    }
                )
            )
        );

        res.status(201).json({ message: 'Users enrolled successfully', enrollments });
    } catch (error) {
        console.error('Error enrolling users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deenrollUsersFromTraining = async (req: AuthRequest & { body: UserEnrollmentRequest, params: TrainingIdEnrollmentParams }, res: Response): Promise<void> => {
    const { trainingId } = req.params;
    const { userIds } = req.body;

    try {
        const deletions = await Promise.all(
            userIds.map((userId: string) =>
                prisma.trainingEnrollment.deleteMany({
                    where: {
                        employeeId: userId,
                        trainingId,
                    },
                })
            )
        );

        res.status(200).json({ message: 'Users disenrolled successfully', deletions });
    } catch (error) {
        console.error('Error disenrolling users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const submitTrainingFeedback = async (req: AuthRequest & { body: TrainingFeedbackRequest, params: TrainingIdFeedbackParams }, res: Response): Promise<void> => {
    const { id: trainingId } = req.params
    const { userId } = req.user!

    const { userInfo, trainingFeedback, trainerFeedback, comments, modeOfAttendance } = req.body

    try {
        const existing = await prisma.trainingFeedback.findUnique({
            where: {
                employeeId_trainingId: {
                    employeeId: userId,
                    trainingId,
                },
            },
        })

        if (existing) {
            res.status(400).json({ error: 'Feedback already submitted for this training.' })
            return
        }

        const training = await prisma.training.findUnique({
            where: { id: trainingId },
            select: {
                totalParticipants: true,
                totalRating: true,
            },
        })

        const participantCount = training?.totalParticipants ?? 0
        const currentTotalRating = training?.totalRating ?? 0

        const allRatings = [
            trainingFeedback.duration,
            trainingFeedback.pace,
            trainingFeedback.content,
            trainingFeedback.relevance,
            trainingFeedback.usefulness,
            trainingFeedback.confidence,
            trainerFeedback.knowledge,
            trainerFeedback.explanation,
            trainerFeedback.answers,
            trainerFeedback.utility,
            trainerFeedback.information,
        ]

        const numericRatings = allRatings.map(r => parseInt(r)).filter(n => !isNaN(n))
        const ratingSum = numericRatings.reduce((acc, n) => acc + n, 0)
        const avgRating = numericRatings.length > 0 ? ratingSum / numericRatings.length : 0

        const updatedRating = ((currentTotalRating * participantCount) + avgRating) / (participantCount + 1)

        await prisma.trainingFeedback.create({
            data: {
                trainingId,
                employeeId: userId,
                participantName: userInfo.name,
                department: userInfo.department,
                durationRating: +trainingFeedback.duration,
                paceRating: +trainingFeedback.pace,
                contentRating: +trainingFeedback.content,
                relevanceRating: +trainingFeedback.relevance,
                usefulnessRating: +trainingFeedback.usefulness,
                confidenceRating: +trainingFeedback.confidence,
                trainerKnowledgeRating: +trainerFeedback.knowledge,
                trainerExplanationRating: +trainerFeedback.explanation,
                trainerAnswersRating: +trainerFeedback.answers,
                trainerUtilityRating: +trainerFeedback.utility,
                trainerInformationRating: +trainerFeedback.information,
                trainingLikes: comments.trainingLikes,
                trainingImprovements: comments.trainingImprovements,
                trainerStrengths: comments.trainerStrengths,
                trainerRecommendations: comments.trainerRecommendations,
                modeOfAttendance,
            },
        })

        await prisma.training.update({
            where: { id: trainingId },
            data: {
                totalParticipants: participantCount + 1,
                totalRating: parseFloat(updatedRating.toFixed(2)),
            },
        })

        res.status(201).json({ message: 'Feedback submitted successfully.' })
        return
    } catch (err) {
        console.error('Error submitting feedback:', err)
        res.status(500).json({ error: 'Internal server error.' })
        return
    }
}

export const getTrainingFeedbacks = async (req: AuthRequest, res: Response): Promise<void> => {
    const { trainingId } = req.params;

    if (!trainingId) {
        res.status(400).json({ error: "Training ID is required" });
        return;
    }

    try {
        const feedbacks = await prisma.trainingFeedback.findMany({
            where: { trainingId },
            select: {
                id: true,
                participantName: true,
                department: true,
                modeOfAttendance: true,
                submittedAt: true,
                durationRating: true,
                paceRating: true,
                contentRating: true,
                relevanceRating: true,
                usefulnessRating: true,
                confidenceRating: true,
                trainerKnowledgeRating: true,
                trainerExplanationRating: true,
                trainerAnswersRating: true,
                trainerUtilityRating: true,
                trainerInformationRating: true,
                trainingLikes: true,
                trainingImprovements: true,
                trainerStrengths: true,
                trainerRecommendations: true
            },
            orderBy: {
                submittedAt: 'desc'
            }
        });

        res.json({
            feedbacks
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch training feedbacks" });
    }
};
