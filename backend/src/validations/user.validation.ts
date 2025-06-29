import { z } from 'zod';

// User creation schema (for single user creation)
export const userCreationSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  employeeid: z
    .string()
    .min(1, 'Employee ID is required')
    .max(50, 'Employee ID must be less than 50 characters')
    .regex(/^[A-Z0-9]+$/, 'Employee ID can only contain uppercase letters and numbers'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters'),
  department: z
    .string()
    .min(1, 'Department is required')
    .max(100, 'Department must be less than 100 characters'),
  phonenumber: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true; // Optional field
      return /^[0-9+\-\s()]+$/.test(val) && val.length >= 10;
    }, {
      message: 'Phone number must be at least 10 digits and can contain numbers, spaces, hyphens, parentheses, and plus sign'
    })
});

// User update schema
export const userUpdateSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .optional(),
  employeeid: z
    .string()
    .min(1, 'Employee ID is required')
    .max(50, 'Employee ID must be less than 50 characters')
    .regex(/^[A-Z0-9]+$/, 'Employee ID can only contain uppercase letters and numbers')
    .optional(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters')
    .optional(),
  department: z
    .string()
    .min(1, 'Department is required')
    .max(100, 'Department must be less than 100 characters')
    .optional(),
  phonenumber: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true; // Optional field
      return /^[0-9+\-\s()]+$/.test(val) && val.length >= 10;
    }, {
      message: 'Phone number must be at least 10 digits and can contain numbers, spaces, hyphens, parentheses, and plus sign'
    })
});

// Password update schema
export const passwordUpdateSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(6, 'New password must be at least 6 characters long')
    .max(100, 'New password must be less than 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  confirmPassword: z
    .string()
    .min(1, 'Password confirmation is required')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

// User search schema
export const userSearchSchema = z.object({
  q: z
    .string()
    .min(1, 'Search query is required')
    .max(100, 'Search query must be less than 100 characters')
    .optional(),
  query: z
    .string()
    .min(1, 'Search query is required')
    .max(100, 'Search query must be less than 100 characters')
    .optional(),
  role: z
    .enum(['EMPLOYEE', 'HR_ADMIN'])
    .optional()
    .describe('Filter by role (ADMIN users are excluded from search results)')
}).refine((data) => {
  // At least one of q or query must be provided
  return data.q || data.query;
}, {
  message: 'Search query is required',
  path: ['q']
});

// User ID parameter schema
export const userIdSchema = z.object({
  id: z.string().min(1, 'User ID is required')
});

// Types
export type UserCreationRequest = z.infer<typeof userCreationSchema>;
export type UserUpdateRequest = z.infer<typeof userUpdateSchema>;
export type PasswordUpdateRequest = z.infer<typeof passwordUpdateSchema>;
export type UserSearchRequest = z.infer<typeof userSearchSchema>;
export type UserIdParams = z.infer<typeof userIdSchema>; 