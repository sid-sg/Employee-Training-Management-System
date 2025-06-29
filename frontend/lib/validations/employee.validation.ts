import { z } from 'zod';

export const phoneNumberSchema = z.object({
  phonenumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be less than 20 characters')
    .regex(/^[0-9+\-\s()]+$/, 'Phone number must contain only numbers, spaces, hyphens, parentheses, and plus sign')
});

export const passwordUpdateSchema = z.object({
  current: z.string().min(1, 'Current password is required'),
  new: z.string()
    .min(6, 'New password must be at least 6 characters')
    .max(100, 'New password must be less than 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  confirm: z.string().min(1, 'Password confirmation is required')
}).refine((data) => data.new === data.confirm, {
  message: 'Passwords do not match',
  path: ['confirm']
});

export const feedbackSchema = z.object({
  userInfo: z.object({
    name: z.string().min(1, 'Name is required').max(100),
    department: z.string().min(1, 'Department is required').max(100)
  }),
  trainingFeedback: z.object({
    duration: z.string().regex(/^[1-5]$/, 'Duration rating must be between 1 and 5'),
    pace: z.string().regex(/^[1-5]$/, 'Pace rating must be between 1 and 5'),
    content: z.string().regex(/^[1-5]$/, 'Content rating must be between 1 and 5'),
    relevance: z.string().regex(/^[1-5]$/, 'Relevance rating must be between 1 and 5'),
    usefulness: z.string().regex(/^[1-5]$/, 'Usefulness rating must be between 1 and 5'),
    confidence: z.string().regex(/^[1-5]$/, 'Confidence rating must be between 1 and 5')
  }),
  trainerFeedback: z.object({
    knowledge: z.string().regex(/^[1-5]$/, 'Knowledge rating must be between 1 and 5'),
    explanation: z.string().regex(/^[1-5]$/, 'Explanation rating must be between 1 and 5'),
    answers: z.string().regex(/^[1-5]$/, 'Answers rating must be between 1 and 5'),
    utility: z.string().regex(/^[1-5]$/, 'Utility rating must be between 1 and 5'),
    information: z.string().regex(/^[1-5]$/, 'Information rating must be between 1 and 5')
  }),
  comments: z.object({
    trainingLikes: z.string().max(500).optional(),
    trainingImprovements: z.string().max(500).optional(),
    trainerStrengths: z.string().max(500).optional(),
    trainerRecommendations: z.string().max(500).optional()
  }),
  modeOfAttendance: z.enum(['IN_PERSON', 'VIRTUAL'])
});

export type PhoneNumberUpdate = z.infer<typeof phoneNumberSchema>;
export type PasswordUpdate = z.infer<typeof passwordUpdateSchema>;
export type FeedbackForm = z.infer<typeof feedbackSchema>; 