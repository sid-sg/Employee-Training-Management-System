import { z } from 'zod';

// Training creation/editing schema
export const trainingFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Training title is required')
    .max(255, 'Training title must be less than 255 characters')
    .trim(),
  description: z
    .string()
    .min(1, 'Training description is required')
    .max(1000, 'Training description must be less than 1000 characters')
    .trim(),
  mode: z
    .enum(['ONLINE', 'OFFLINE'], {
      errorMap: () => ({ message: 'Training mode must be either ONLINE or OFFLINE' })
    }),
  location: z
    .string()
    .optional()
    .refine((val) => {
      // Location is required for OFFLINE mode
      return true; // We'll handle this in the form validation
    }),
  platform: z
    .string()
    .optional()
    .refine((val) => {
      // Platform is required for ONLINE mode
      return true; // We'll handle this in the form validation
    }),
  startDate: z
    .string()
    .min(1, 'Start date is required')
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, {
      message: 'Invalid start date format'
    }),
  endDate: z
    .string()
    .min(1, 'End date is required')
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, {
      message: 'Invalid end date format'
    })
}).refine((data) => {
  // Validate that start date is before end date
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  return startDate < endDate;
}, {
  message: 'End date must be after start date',
  path: ['endDate']
}).refine((data) => {
  // Validate that location is provided for OFFLINE mode
  if (data.mode === 'OFFLINE') {
    return data.location && data.location.trim().length > 0;
  }
  return true;
}, {
  message: 'Location is required for offline training',
  path: ['location']
}).refine((data) => {
  // Validate that platform is provided for ONLINE mode
  if (data.mode === 'ONLINE') {
    return data.platform && data.platform.trim().length > 0;
  }
  return true;
}, {
  message: 'Platform is required for online training',
  path: ['platform']
});

// Training update schema (separate schema for updates)
export const trainingUpdateSchema = z.object({
  title: z
    .string()
    .min(1, 'Training title is required')
    .max(255, 'Training title must be less than 255 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .min(1, 'Training description is required')
    .max(1000, 'Training description must be less than 1000 characters')
    .trim()
    .optional(),
  mode: z
    .enum(['ONLINE', 'OFFLINE'], {
      errorMap: () => ({ message: 'Training mode must be either ONLINE or OFFLINE' })
    })
    .optional(),
  location: z
    .string()
    .optional(),
  platform: z
    .string()
    .optional(),
  startDate: z
    .string()
    .min(1, 'Start date is required')
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, {
      message: 'Invalid start date format'
    })
    .optional(),
  endDate: z
    .string()
    .min(1, 'End date is required')
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, {
      message: 'Invalid end date format'
    })
    .optional()
}).refine((data: any) => {
  // If both dates are provided, validate the order
  if (data.startDate && data.endDate) {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    return startDate < endDate;
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['endDate']
});

// Employee assignment schema
export const employeeAssignmentSchema = z.object({
  employeeIds: z
    .array(z.string().min(1, 'Employee ID is required'))
    .min(1, 'At least one employee must be selected')
    .max(100, 'Cannot assign more than 100 employees at once')
});

// Employee search schema
export const employeeSearchSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .max(100, 'Search query must be less than 100 characters')
    .trim()
});

// Employee interface for type safety
export interface Employee {
  id: string;
  name: string;
  employeeid: string;
  email: string;
  department: string;
}

// Types
export type TrainingFormData = z.infer<typeof trainingFormSchema>;
export type TrainingUpdateData = z.infer<typeof trainingUpdateSchema>;
export type EmployeeAssignmentData = z.infer<typeof employeeAssignmentSchema>;
export type EmployeeSearchData = z.infer<typeof employeeSearchSchema>; 