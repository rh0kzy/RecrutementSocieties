import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { generateToken, authenticate, AuthRequest } from '../lib/jwt';
import { sendPasswordResetEmail } from '../lib/email';
import { validate } from '../lib/validate';
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../lib/validation/auth.schema';

const prisma = new PrismaClient();
const router = express.Router();

// ========================================
// GENERIC SIGNUP
// ========================================
router.post('/signup', validate(signupSchema), async (req, res) => {
  try {
    const { email, password, role, companyName, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'A user with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    switch (role) {
      case 'ADMIN':
        user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            role: 'ADMIN',
            admin: {
              create: {},
            },
          },
        });
        break;
      case 'COMPANY':
        if (!companyName) {
          return res.status(400).json({ error: 'Company name is required for company signup.' });
        }
        user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            role: 'COMPANY',
            company: {
              create: { name: companyName },
            },
          },
        });
        break;
      case 'CANDIDATE':
        if (!firstName || !lastName) {
          return res.status(400).json({ error: 'First and last name are required for candidate signup.' });
        }
        user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            role: 'CANDIDATE',
            candidate: {
              create: { firstName, lastName },
            },
          },
        });
        break;
      default:
        return res.status(400).json({ error: 'Invalid role specified.' });
    }

    // Don't send password back
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      message: `${role} account created successfully.`,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ error: 'An error occurred during signup.' });
  }
});


// ========================================
// GENERIC LOGIN
// ========================================
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        admin: true,
        company: true,
        candidate: true,
      },
    });

    if (!user || user.role !== role) {
      return res.status(401).json({ error: 'Invalid credentials or role.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials or role.' });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Prepare user object to return
    let userProfile;
    switch (user.role) {
        case 'ADMIN':
            userProfile = user.admin;
            break;
        case 'COMPANY':
            userProfile = user.company;
            break;
        case 'CANDIDATE':
            userProfile = user.candidate;
            break;
    }

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: userProfile,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'An error occurred during login.' });
  }
});


// ========================================
// PASSWORD RESET
// ========================================

/**
 * Forgot Password - Request reset token
 * POST /api/auth/forgot-password
 */
router.post('/forgot-password', validate(forgotPasswordSchema), async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Don't reveal if user exists or not
      return res.status(200).json({ success: true, message: 'If an account with this email exists, a password reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = await bcrypt.hash(resetToken, 10);
    const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour from now

    await prisma.user.update({
      where: { email },
      data: {
        passwordResetToken,
        passwordResetExpires,
      },
    });

    // Construct reset URL
    // IMPORTANT: The frontend URL should come from an environment variable
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    await sendPasswordResetEmail(user.email, resetUrl);

    res.json({ success: true, message: 'If an account with this email exists, a password reset link has been sent.' });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

/**
 * Reset Password - With valid token
 * POST /api/auth/reset-password/:token
 */
router.post('/reset-password/:token', validate(resetPasswordSchema), async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // This part is tricky. We stored a hashed token, but the user gives us the raw one.
    // We need to find a user whose `passwordResetToken` could match the provided token.
    // This is inefficient. A better approach is to store the hashed token directly.
    // Let's adjust the logic assuming we can't easily query by the raw token.
    // A common pattern is to find the user by email if it's part of the reset flow,
    // or to find the user whose reset token is not null and not expired.

    const usersWithTokens = await prisma.user.findMany({
        where: {
            passwordResetToken: { not: null },
            passwordResetExpires: { gt: new Date() }
        }
    });

    let user = null;
    for (const u of usersWithTokens) {
        if (u.passwordResetToken && await bcrypt.compare(token, u.passwordResetToken)) {
            user = u;
            break;
        }
    }

    if (!user) {
      return res.status(400).json({ error: 'Password reset token is invalid or has expired.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    res.json({ success: true, message: 'Password has been reset successfully.' });

  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ error: 'An error occurred while resetting your password.' });
  }
});


// ========================================
// PROTECTED TEST ROUTE
// ========================================

/**
 * Example of a protected route
 * GET /api/auth/me
 */
router.get('/me', authenticate, (req: AuthRequest, res) => {
  // The user object is attached to the request by the `authenticate` middleware
  res.json({ user: req.user });
});

export default router;
