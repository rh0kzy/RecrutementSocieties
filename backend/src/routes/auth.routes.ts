import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { generateToken, authenticate, AuthRequest } from '../lib/jwt';
import { sendPasswordResetEmail } from '../lib/email';

const prisma = new PrismaClient();
const router = express.Router();

// ========================================
// ADMIN AUTHENTICATION
// ========================================

/**
 * Admin Login
 * POST /api/auth/admin/login
 */
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find admin by email
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: 'ADMIN'
    });

    res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        email: admin.email,
        role: 'ADMIN',
        createdAt: admin.createdAt
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Admin Signup (restricted - only for initial setup)
 * POST /api/auth/admin/signup
 * Note: In production, this should be disabled or require a master key
 */
router.post('/admin/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if email already exists
    const existingAdmin = await prisma.admin.findUnique({ where: { email } });

    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin with this email already exists' });
    }

    // Check password strength (minimum 8 characters)
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword
      }
    });

    // Generate token
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: 'ADMIN'
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: admin.id,
        email: admin.email,
        role: 'ADMIN',
        createdAt: admin.createdAt
      }
    });
  } catch (error) {
    console.error('Admin signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get current admin info (protected route)
 * GET /api/auth/admin/me
 */
router.get('/admin/me', authenticate, async (req: AuthRequest, res) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, createdAt: true }
    });

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json({
      success: true,
      user: {
        ...admin,
        role: 'ADMIN'
      }
    });
  } catch (error) {
    console.error('Get admin info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========================================
// COMPANY AUTHENTICATION
// ========================================

/**
 * Company Signup
 * POST /api/auth/company/signup
 */
router.post('/company/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if email already exists
    const existingCompany = await prisma.company.findUnique({ where: { email } });

    if (existingCompany) {
      return res.status(400).json({ error: 'Company with this email already exists' });
    }

    // Check password strength
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create company
    const company = await prisma.company.create({
      data: {
        name,
        email,
        password: hashedPassword,
        active: false // Company starts inactive until admin approves
      }
    });

    res.status(201).json({
      success: true,
      message: 'Company registered successfully. Awaiting admin approval.',
      company: {
        id: company.id,
        name: company.name,
        email: company.email,
        active: company.active,
        createdAt: company.createdAt
      }
    });
  } catch (error) {
    console.error('Company signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Company Login
 * POST /api/auth/company/login
 */
router.post('/company/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find company by email
    const company = await prisma.company.findUnique({ where: { email } });

    if (!company) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if company is active
    if (!company.active) {
      return res.status(403).json({ error: 'Account is inactive. Please contact admin.' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, company.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken({
      id: company.id,
      email: company.email,
      role: 'COMPANY'
    });

    res.json({
      success: true,
      token,
      user: {
        id: company.id,
        name: company.name,
        email: company.email,
        role: 'COMPANY',
        active: company.active,
        createdAt: company.createdAt
      }
    });
  } catch (error) {
    console.error('Company login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========================================
// CANDIDATE AUTHENTICATION
// ========================================

/**
 * Candidate Signup
 * POST /api/auth/candidate/signup
 */
router.post('/candidate/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if email already exists
    const existingCandidate = await prisma.candidate.findUnique({ where: { email } });

    if (existingCandidate) {
      return res.status(400).json({ error: 'Candidate with this email already exists' });
    }

    // Check password strength
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create candidate
    const candidate = await prisma.candidate.create({
      data: {
        email,
        password: hashedPassword
      }
    });

    // Generate token
    const token = generateToken({
      id: candidate.id,
      email: candidate.email,
      role: 'CANDIDATE'
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: candidate.id,
        email: candidate.email,
        role: 'CANDIDATE',
        createdAt: candidate.createdAt
      }
    });
  } catch (error) {
    console.error('Candidate signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Candidate Login
 * POST /api/auth/candidate/login
 */
router.post('/candidate/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find candidate by email
    const candidate = await prisma.candidate.findUnique({ where: { email } });

    if (!candidate) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, candidate.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken({
      id: candidate.id,
      email: candidate.email,
      role: 'CANDIDATE'
    });

    res.json({
      success: true,
      token,
      user: {
        id: candidate.id,
        email: candidate.email,
        role: 'CANDIDATE',
        createdAt: candidate.createdAt
      }
    });
  } catch (error) {
    console.error('Candidate login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========================================
// PASSWORD RESET
// ========================================

/**
 * Request a password reset email.
 * POST /api/auth/forgot-password
 */
router.post('/forgot-password', async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ error: 'Email and role are required' });
  }

  try {
    let user: any = null;
    const userModel = role.toLowerCase();

    if (!['admin', 'company', 'candidate'].includes(userModel)) {
        return res.status(400).json({ error: 'Invalid role specified' });
    }

    user = await (prisma as any)[userModel].findUnique({ where: { email } });

    // Always return a success message to prevent user enumeration
    if (!user) {
      console.log(`Password reset requested for non-existent user: ${email} with role: ${role}`);
      return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token expiry to 1 hour from now
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save the hashed token and expiry date to the user
    await (prisma as any)[userModel].update({
      where: { id: user.id },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry,
      },
    });

    // Send the password reset email with the unhashed token
    await sendPasswordResetEmail(user.email, resetToken, role);

    res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    // Do not reveal internal errors to the client
    res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  }
});


/**
 * Reset the password using a valid token.
 * POST /api/auth/reset-password
 */
router.post('/reset-password', async (req, res) => {
    const { token, password, role } = req.body;

    if (!token || !password || !role) {
        return res.status(400).json({ error: 'Token, password, and role are required' });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const userModel = role.toLowerCase();

        if (!['admin', 'company', 'candidate'].includes(userModel)) {
            return res.status(400).json({ error: 'Invalid role specified' });
        }

        const user = await (prisma as any)[userModel].findFirst({
            where: {
                resetToken: hashedToken,
                resetTokenExpiry: {
                    gt: new Date(),
                },
            },
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password and clear the reset token fields
        await (prisma as any)[userModel].update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * Validate a password reset token.
 * GET /api/auth/validate-token
 */
router.get('/validate-token', async (req, res) => {
    const { token, role } = req.query;

    if (!token || !role || typeof token !== 'string' || typeof role !== 'string') {
        return res.status(400).json({ valid: false, message: 'Token and role are required' });
    }

    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const userModel = role.toLowerCase();

        if (!['admin', 'company', 'candidate'].includes(userModel)) {
            return res.status(400).json({ valid: false, message: 'Invalid role specified' });
        }

        const user = await (prisma as any)[userModel].findFirst({
            where: {
                resetToken: hashedToken,
                resetTokenExpiry: {
                    gt: new Date(),
                },
            },
        });

        if (user) {
            res.status(200).json({ valid: true });
        } else {
            res.status(400).json({ valid: false, message: 'Invalid or expired token' });
        }
    } catch (error) {
        console.error('Validate token error:', error);
        res.status(500).json({ valid: false, message: 'Internal server error' });
    }
});


export default router;
