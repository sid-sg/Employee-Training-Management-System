import { z } from 'zod';

// Training creation/update schema
export const trainingSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be less than 1000 characters'),
  mode: z.enum(['ONLINE', 'OFFLINE'], {
    errorMap: () => ({ message: 'Mode must be either ONLINE or OFFLINE' })
  }),
  location: z
    .string()
    .optional()
    .refine((val) => {
      // Location is required for OFFLINE mode
      return true; // We'll handle this in the controller with conditional validation
    }),
  platform: z
    .string()
    .optional()
    .refine((val) => {
      // Platform is required for ONLINE mode
      return true; // We'll handle this in the controller with conditional validation
    }),
  startDate: z
    .string()
    .min(1, 'Start date is required')
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Start date must be a valid date'
    }),
  endDate: z
    .string()
    .min(1, 'End date is required')
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'End date must be a valid date'
    })
}).refine((data) => {
  // Ensure end date is after start date
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  return endDate > startDate;
}, {
  message: 'End date must be after start date',
  path: ['endDate']
}).refine((data) => {
  // Ensure location is provided for OFFLINE mode
  if (data.mode === 'OFFLINE' && !data.location) {
    return false;
  }
  return true;
}, {
  message: 'Location is required for offline trainings',
  path: ['location']
}).refine((data) => {
  // Ensure platform is provided for ONLINE mode
  if (data.mode === 'ONLINE' && !data.platform) {
    return false;
  }
  return true;
}, {
  message: 'Platform is required for online trainings',
  path: ['platform']
});

// Training update schema (all fields optional)
export const trainingUpdateSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .optional(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  mode: z.enum(['ONLINE', 'OFFLINE'], {
    errorMap: () => ({ message: 'Mode must be either ONLINE or OFFLINE' })
  }).optional(),
  location: z
    .string()
    .optional(),
  platform: z
    .string()
    .optional(),
  startDate: z
    .string()
    .min(1, 'Start date is required')
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Start date must be a valid date'
    })
    .optional(),
  endDate: z
    .string()
    .min(1, 'End date is required')
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'End date must be a valid date'
    })
    .optional()
}).refine((data) => {
  // If both dates are provided, ensure end date is after start date
  if (data.startDate && data.endDate) {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    return endDate > startDate;
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['endDate']
});

// User enrollment schema
export const userEnrollmentSchema = z.object({
  userIds: z
    .array(z.string().min(1, 'User ID is required'))
    .min(1, 'At least one user ID is required')
    .max(100, 'Cannot enroll more than 100 users at once')
});

// Training ID parameter schema
export const trainingIdSchema = z.object({
  id: z.string().min(1, 'Training ID is required')
});

// Training ID parameter schema for enrollment operations
export const trainingIdEnrollmentSchema = z.object({
  trainingId: z.string().min(1, 'Training ID is required')
});

// Types
export type TrainingRequest = z.infer<typeof trainingSchema>;
export type TrainingUpdateRequest = z.infer<typeof trainingUpdateSchema>;
export type UserEnrollmentRequest = z.infer<typeof userEnrollmentSchema>;
export type TrainingIdParams = z.infer<typeof trainingIdSchema>;
export type TrainingIdEnrollmentParams = z.infer<typeof trainingIdEnrollmentSchema>; 