import { z } from 'zod';

// Admin user creation schema (for single user creation)
export const adminUserCreationSchema = z.object({
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
      if (!val) return true;
      return /^[0-9+\-\s()]+$/.test(val) && val.length >= 10;
    }, {
      message: 'Phone number must be at least 10 digits and can contain numbers, spaces, hyphens, parentheses, and plus sign'
    })
});

// Admin bulk upload schema (for file uploads only)
export const adminFileUploadSchema = z.object({
  // This schema will be used when a file is present
  // The actual file validation is handled by multer middleware
});

// Admin bulk upload schema (combines file and user data validation)
export const adminBulkUploadSchema = z.union([
  // Schema for file uploads (minimal validation since multer handles file validation)
  z.object({
    // Empty object for file uploads - multer handles the file validation
  }),
  // Schema for single user creation
  adminUserCreationSchema
]);

// Admin dashboard stats schema
export const adminStatsSchema = z.object({
  period: z
    .enum(['week', 'month', 'year', 'all'])
    .optional()
    .default('all')
    .describe('Time period for statistics')
});

// Admin user management schema
export const adminUserManagementSchema = z.object({
  action: z
    .enum(['activate', 'deactivate', 'delete'])
    .describe('Action to perform on user'),
  userId: z
    .string()
    .min(1, 'User ID is required')
    .describe('ID of the user to manage')
});

// Types
export type AdminUserCreationRequest = z.infer<typeof adminUserCreationSchema>;
export type AdminFileUploadRequest = z.infer<typeof adminFileUploadSchema>;
export type AdminBulkUploadRequest = z.infer<typeof adminBulkUploadSchema>;
export type AdminStatsRequest = z.infer<typeof adminStatsSchema>;
export type AdminUserManagementRequest = z.infer<typeof adminUserManagementSchema>; 