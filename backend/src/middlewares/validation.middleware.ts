import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';

export const validate = (schema: ZodType) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      if (error.errors) {
        const errorMessages = error.errors.map((err: any) => err.message);
        res.status(400).json({
          message: 'Validation failed',
          errors: errorMessages,
        });
        return;
      }
      res.status(400).json({
        message: 'Invalid request data',
      });
      return;
    }
  };
};

// Custom validation for admin bulk uploads that handles both file uploads and single user creation
export const validateAdminBulkUpload = (userSchema: ZodType) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // If there's a file, it's a file upload (multer handles file validation)
      if (req.file) {
        // For file uploads, we don't need to validate req.body
        next();
        return;
      }
      
      // If no file, validate as single user creation
      await userSchema.parseAsync(req.body);
      next();
    } catch (error: any) {
      if (error.errors) {
        const errorMessages = error.errors.map((err: any) => err.message);
        res.status(400).json({
          message: 'Validation failed',
          errors: errorMessages,
        });
        return;
      }
      res.status(400).json({
        message: 'Invalid request data',
      });
      return;
    }
  };
};

export const validateParams = (schema: ZodType) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.params);
      next();
    } catch (error: any) {
      if (error.errors) {
        const errorMessages = error.errors.map((err: any) => err.message);
        res.status(400).json({
          message: 'Invalid parameters',
          errors: errorMessages,
        });
        return;
      }
      res.status(400).json({
        message: 'Invalid parameters',
      });
      return;
    }
  };
};

export const validateQuery = (schema: ZodType) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.query);
      next();
    } catch (error: any) {
      if (error.errors) {
        const errorMessages = error.errors.map((err: any) => err.message);
        res.status(400).json({
          message: 'Invalid query parameters',
          errors: errorMessages,
        });
        return;
      }
      res.status(400).json({
        message: 'Invalid query parameters',
      });
      return;
    }
  };
}; 