import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest, requireRole } from '../lib/jwt';

const prisma = new PrismaClient();
const router = express.Router();

// ========================================
// ADMIN: Get all companies with search and filter
// ========================================
router.get('/', authenticate, requireRole(['ADMIN']), async (req: AuthRequest, res) => {
  try {
    const { search, status, sortBy = 'createdAt', order = 'desc', page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause for filtering
    const where: any = {};

    // Search by company name or user email
    if (search) {
      where.OR = [
        { companyName: { contains: search as string, mode: 'insensitive' } },
        { user: { email: { contains: search as string, mode: 'insensitive' } } },
      ];
    }

    // Filter by status
    if (status && status !== 'all') {
      where.status = status;
    }

    // Get total count for pagination
    const total = await prisma.company.count({ where });

    // Fetch companies with user data
    const companies = await prisma.company.findMany({
      where,
      include: {
        user: {
          select: {
            email: true,
            createdAt: true,
          },
        },
        jobs: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            jobs: true,
          },
        },
      },
      orderBy: {
        [sortBy as string]: order as 'asc' | 'desc',
      },
      skip,
      take: limitNum,
    });

    // Format response
    const formattedCompanies = companies.map((company) => ({
      id: company.id,
      companyName: company.companyName,
      email: company.user.email,
      status: company.status,
      paymentStatus: company.paymentStatus,
      jobsCount: company._count.jobs,
      createdAt: company.user.createdAt,
      updatedAt: company.updatedAt,
    }));

    res.json({
      companies: formattedCompanies,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// ========================================
// ADMIN: Get single company details
// ========================================
router.get('/:id', authenticate, requireRole(['ADMIN']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const companyId = parseInt(id, 10);

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        user: {
          select: {
            email: true,
            createdAt: true,
          },
        },
        jobs: {
          select: {
            id: true,
            title: true,
            deadline: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            jobs: true,
          },
        },
      },
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

// ========================================
// ADMIN: Create new company
// ========================================
router.post('/', authenticate, requireRole(['ADMIN']), async (req: AuthRequest, res) => {
  try {
    const { email, password, companyName, status = 'ACTIVE', paymentStatus = 'PENDING' } = req.body;

    // Validate required fields
    if (!email || !password || !companyName) {
      return res.status(400).json({ error: 'Email, password, and company name are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }

    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and company in a transaction
    const company = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'COMPANY',
        company: {
          create: {
            companyName,
            status,
            paymentStatus,
          },
        },
      },
      include: {
        company: true,
      },
    });

    res.status(201).json({
      message: 'Company created successfully',
      company: {
        id: company.company?.id,
        companyName: company.company?.companyName,
        email: company.email,
        status: company.company?.status,
        paymentStatus: company.company?.paymentStatus,
      },
    });
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Failed to create company' });
  }
});

// ========================================
// ADMIN: Update company status
// ========================================
router.patch('/:id/status', authenticate, requireRole(['ADMIN']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const companyId = parseInt(id, 10);

    if (!['ACTIVE', 'INACTIVE', 'SUSPENDED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be ACTIVE, INACTIVE, or SUSPENDED' });
    }

    const company = await prisma.company.update({
      where: { id: companyId },
      data: { status },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    res.json({
      message: 'Company status updated successfully',
      company: {
        id: company.id,
        companyName: company.companyName,
        email: company.user.email,
        status: company.status,
      },
    });
  } catch (error) {
    console.error('Error updating company status:', error);
    res.status(500).json({ error: 'Failed to update company status' });
  }
});

// ========================================
// ADMIN: Delete company
// ========================================
router.delete('/:id', authenticate, requireRole(['ADMIN']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const companyId = parseInt(id, 10);

    // Find company with user
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { userId: true },
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Delete in transaction (cascade will handle related records)
    await prisma.user.delete({
      where: { id: company.userId },
    });

    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ error: 'Failed to delete company' });
  }
});

// ========================================
// ADMIN: Reset company password
// ========================================
router.post('/:id/reset-password', authenticate, requireRole(['ADMIN']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    const companyId = parseInt(id, 10);

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { userId: true },
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: company.userId },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

export default router;
