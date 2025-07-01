

import { z } from 'zod';

export const adminUserCreationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  employeeid: z.string().min(1, 'Employee ID is required').max(50).regex(/^[A-Z0-9]+$/, 'Employee ID can only contain uppercase letters and numbers'),
  email: z.string().min(1, 'Email is required').email('Invalid email format').max(255),
  department: z.string().min(1, 'Department is required').max(100),
  phonenumber: z.string().optional().refine((val) => {
    if (!val) return true;
    return /^[0-9+\-\s()]+$/.test(val) && val.length >= 10;
  }, {
    message: 'Phone number must be at least 10 digits and can contain numbers, spaces, hyphens, parentheses, and plus sign'
  }),
  role: z.enum(['EMPLOYEE', 'HR_ADMIN'])
});

export const adminFileUploadSchema =
  typeof window !== "undefined"
    ? z.object({
        file: z.instanceof(File).refine(f => f.type === "text/csv", "Must be a CSV file")
      })
    : z.any(); 

export type AdminUserCreation = z.infer<typeof adminUserCreationSchema>;
export type AdminFileUpload = z.infer<typeof adminFileUploadSchema>; 