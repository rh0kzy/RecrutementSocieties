import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

export const validate =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation error',
          errors: error.issues,
        });
      }
      next(error);
    }
  };

// Role-based access control middleware
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized - No user found' });
    }
    
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ 
        message: 'Forbidden - Insufficient permissions',
        requiredRoles: allowedRoles,
        userRole: user.role
      });
    }
    
    next();
  };
};
