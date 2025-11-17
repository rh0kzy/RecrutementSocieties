import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'change_me_in_production';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

export interface JwtPayload {
  id: number;
  email: string;
  role: 'ADMIN' | 'COMPANY' | 'CANDIDATE';
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

/**
 * Generate a JWT token for a user
 */
export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verify a JWT token and return the payload
 */
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Middleware to authenticate requests
 * Extracts token from Authorization header and verifies it
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const payload = verifyToken(token);

    if (!payload) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

/**
 * Middleware to check if user has required role
 */
export const authorize = (...roles: Array<'ADMIN' | 'COMPANY' | 'CANDIDATE'>) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};