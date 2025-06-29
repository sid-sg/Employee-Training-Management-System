import { z } from 'zod';

// Phone number update schema
export const phoneNumberUpdateSchema = z.object({
  phonenumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[0-9+\-\s()]+$/, 'Phone number must contain only numbers, spaces, hyphens, parentheses, and plus sign')
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be less than 20 characters')
});

// Training feedback schema
export const trainingFeedbackSchema = z.object({
  userInfo: z.object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(100, 'Name must be less than 100 characters'),
    department: z
      .string()
      .min(1, 'Department is required')
      .max(100, 'Department must be less than 100 characters')
  }),
  trainingFeedback: z.object({
    duration: z
      .string()
      .min(1, 'Duration rating is required')
      .regex(/^[1-5]$/, 'Duration rating must be between 1 and 5'),
    pace: z
      .string()
      .min(1, 'Pace rating is required')
      .regex(/^[1-5]$/, 'Pace rating must be between 1 and 5'),
    content: z
      .string()
      .min(1, 'Content rating is required')
      .regex(/^[1-5]$/, 'Content rating must be between 1 and 5'),
    relevance: z
      .string()
      .min(1, 'Relevance rating is required')
      .regex(/^[1-5]$/, 'Relevance rating must be between 1 and 5'),
    usefulness: z
      .string()
      .min(1, 'Usefulness rating is required')
      .regex(/^[1-5]$/, 'Usefulness rating must be between 1 and 5'),
    confidence: z
      .string()
      .min(1, 'Confidence rating is required')
      .regex(/^[1-5]$/, 'Confidence rating must be between 1 and 5')
  }),
  trainerFeedback: z.object({
    knowledge: z
      .string()
      .min(1, 'Knowledge rating is required')
      .regex(/^[1-5]$/, 'Knowledge rating must be between 1 and 5'),
    explanation: z
      .string()
      .min(1, 'Explanation rating is required')
      .regex(/^[1-5]$/, 'Explanation rating must be between 1 and 5'),
    answers: z
      .string()
      .min(1, 'Answers rating is required')
      .regex(/^[1-5]$/, 'Answers rating must be between 1 and 5'),
    utility: z
      .string()
      .min(1, 'Utility rating is required')
      .regex(/^[1-5]$/, 'Utility rating must be between 1 and 5'),
    information: z
      .string()
      .min(1, 'Information rating is required')
      .regex(/^[1-5]$/, 'Information rating must be between 1 and 5')
  }),
  comments: z.object({
    trainingLikes: z
      .string()
      .max(500, 'Training likes must be less than 500 characters')
      .optional(),
    trainingImprovements: z
      .string()
      .max(500, 'Training improvements must be less than 500 characters')
      .optional(),
    trainerStrengths: z
      .string()
      .max(500, 'Trainer strengths must be less than 500 characters')
      .optional(),
    trainerRecommendations: z
      .string()
      .max(500, 'Trainer recommendations must be less than 500 characters')
      .optional()
  }),
  modeOfAttendance: z
    .enum(['IN_PERSON', 'VIRTUAL'], {
      errorMap: () => ({ message: 'Mode of attendance must be either IN_PERSON or VIRTUAL' })
    })
});

// Training rating schema (for enrollment routes)
export const trainingRatingSchema = z.object({
  rating: z
    .number()
    .min(0, 'Rating must be at least 0')
    .max(5, 'Rating must be at most 5')
});

// User ID parameter schema
export const userIdSchema = z.object({
  id: z.string().min(1, 'User ID is required')
});

// Training ID parameter schema for feedback
export const trainingIdFeedbackSchema = z.object({
  id: z.string().min(1, 'Training ID is required')
});

// Types
export type PhoneNumberUpdateRequest = z.infer<typeof phoneNumberUpdateSchema>;
export type TrainingFeedbackRequest = z.infer<typeof trainingFeedbackSchema>;
export type TrainingRatingRequest = z.infer<typeof trainingRatingSchema>;
export type UserIdParams = z.infer<typeof userIdSchema>;
export type TrainingIdFeedbackParams = z.infer<typeof trainingIdFeedbackSchema>; 