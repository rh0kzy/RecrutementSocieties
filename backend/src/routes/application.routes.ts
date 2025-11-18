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

// Candidate submit application (placeholder, file uploads not implemented)
router.post('/', async (req, res) => {
  const { candidateId, jobId, companyId } = req.body;
  if (!candidateId || !jobId || !companyId) return res.status(400).json({ error: 'Missing fields' });
  try {
    // Placeholder: We will store files using Supabase Storage with signed URLs (front-end). For now, create app record.
    const application = await prisma.application.create({ data: { candidateId: Number(candidateId), jobId: Number(jobId), companyId: Number(companyId) } });
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
