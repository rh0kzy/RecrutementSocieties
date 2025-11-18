import express from 'express';
import { PrismaClient } from '@prisma/client';
import supabase from '../lib/supabase';
import { authenticate } from '../lib/jwt';
import { requireRole } from '../lib/validate';

const prisma = new PrismaClient();
const router = express.Router();

// Admin: Get all applications across companies with pagination and filters
router.get('/admin/all', authenticate, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { page = '1', limit = '10', search = '', status = 'all', companyId = '' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};
    
    if (status && status !== 'all') {
      where.status = status;
    }
    
    if (companyId && companyId !== 'all') {
      where.companyId = parseInt(companyId as string);
    }
    
    if (search) {
      where.OR = [
        { candidate: { firstName: { contains: search as string, mode: 'insensitive' } } },
        { candidate: { lastName: { contains: search as string, mode: 'insensitive' } } },
        { job: { title: { contains: search as string, mode: 'insensitive' } } },
        { company: { companyName: { contains: search as string, mode: 'insensitive' } } },
      ];
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          candidate: {
            include: {
              user: {
                select: { email: true }
              }
            }
          },
          job: {
            select: { title: true, deadline: true }
          },
          company: {
            select: { companyName: true }
          }
        }
      }),
      prisma.application.count({ where })
    ]);

    res.json({
      applications,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Candidate submit application
router.post('/', authenticate, requireRole(['CANDIDATE']), async (req, res) => {
  try {
    const user = (req as any).user;
    const { jobId, companyId, profile, answers } = req.body;

    // Validation
    if (!jobId || !companyId) {
      return res.status(400).json({ error: 'Job ID and Company ID are required' });
    }

    if (!profile || !profile.firstName || !profile.lastName) {
      return res.status(400).json({ error: 'Profile information is required' });
    }

    // Get candidate
    const candidate = await prisma.candidate.findUnique({
      where: { userId: user.id }
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate profile not found' });
    }

    // Verify job exists and belongs to the company
    const job = await prisma.job.findFirst({
      where: {
        id: parseInt(jobId),
        companyId: parseInt(companyId)
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if candidate already applied to this job
    const existingApplication = await prisma.application.findFirst({
      where: {
        candidateId: candidate.id,
        jobId: parseInt(jobId)
      }
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied to this job' });
    }

    // Update candidate profile
    await prisma.candidate.update({
      where: { id: candidate.id },
      data: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        profile: {
          phone: profile.phone || null,
          address: profile.address || null,
          dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : null,
          education: profile.education || [],
          experience: profile.experience || [],
          cvUrl: profile.cvUrl || null,
          idCardUrl: profile.idCardUrl || null,
          militaryStatusUrl: profile.militaryStatusUrl || null
        }
      }
    });

    // Create application
    const application = await prisma.application.create({
      data: {
        candidateId: candidate.id,
        jobId: parseInt(jobId),
        companyId: parseInt(companyId),
        answers: answers || null
      }
    });

    // Log IP address
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    await prisma.iPLog.create({
      data: {
        ip: clientIP,
        candidateId: candidate.id
      }
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      applicationId: application.id
    });
  } catch (err) {
    console.error('Error submitting application:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
