import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../lib/jwt';
import { requireRole } from '../lib/validate';

const prisma = new PrismaClient();
const router = express.Router();

// Get all jobs for authenticated company
router.get(
  '/my-jobs',
  authenticate,
  requireRole(['COMPANY']),
  async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      // Get company from user
      const company = await prisma.company.findUnique({
        where: { userId: user.id }
      });

      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }

      const jobs = await prisma.job.findMany({
        where: { companyId: company.id },
        include: {
          _count: {
            select: { applications: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json(jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ message: 'Error fetching jobs' });
    }
  }
);

// Get single job by ID
router.get(
  '/:id',
  authenticate,
  requireRole(['COMPANY']),
  async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const jobId = parseInt(req.params.id);

      // Get company from user
      const company = await prisma.company.findUnique({
        where: { userId: user.id }
      });

      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }

      const job = await prisma.job.findFirst({
        where: {
          id: jobId,
          companyId: company.id
        },
        include: {
          _count: {
            select: { applications: true }
          }
        }
      });

      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      res.json(job);
    } catch (error) {
      console.error('Error fetching job:', error);
      res.status(500).json({ message: 'Error fetching job' });
    }
  }
);

// Create new job
router.post(
  '/',
  authenticate,
  requireRole(['COMPANY']),
  async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const { title, description, deadline, extraQuestions } = req.body;

      // Validation
      if (!title || title.trim().length === 0) {
        return res.status(400).json({ message: 'Job title is required' });
      }

      if (!description || description.trim().length === 0) {
        return res.status(400).json({ message: 'Job description is required' });
      }

      // Get company from user
      const company = await prisma.company.findUnique({
        where: { userId: user.id }
      });

      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }

      // Validate deadline if provided
      let deadlineDate = null;
      if (deadline) {
        deadlineDate = new Date(deadline);
        if (isNaN(deadlineDate.getTime())) {
          return res.status(400).json({ message: 'Invalid deadline date' });
        }
        if (deadlineDate < new Date()) {
          return res.status(400).json({ message: 'Deadline must be in the future' });
        }
      }

      const job = await prisma.job.create({
        data: {
          title: title.trim(),
          description: description.trim(),
          deadline: deadlineDate,
          extraQuestions: extraQuestions || null,
          companyId: company.id
        }
      });

      res.status(201).json(job);
    } catch (error) {
      console.error('Error creating job:', error);
      res.status(500).json({ message: 'Error creating job' });
    }
  }
);

// Update job
router.put(
  '/:id',
  authenticate,
  requireRole(['COMPANY']),
  async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const jobId = parseInt(req.params.id);
      const { title, description, deadline, extraQuestions } = req.body;

      // Get company from user
      const company = await prisma.company.findUnique({
        where: { userId: user.id }
      });

      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }

      // Check if job exists and belongs to company
      const existingJob = await prisma.job.findFirst({
        where: {
          id: jobId,
          companyId: company.id
        }
      });

      if (!existingJob) {
        return res.status(404).json({ message: 'Job not found' });
      }

      // Validation
      if (title && title.trim().length === 0) {
        return res.status(400).json({ message: 'Job title cannot be empty' });
      }

      if (description && description.trim().length === 0) {
        return res.status(400).json({ message: 'Job description cannot be empty' });
      }

      // Validate deadline if provided
      let deadlineDate = undefined;
      if (deadline !== undefined) {
        if (deadline === null) {
          deadlineDate = null;
        } else {
          deadlineDate = new Date(deadline);
          if (isNaN(deadlineDate.getTime())) {
            return res.status(400).json({ message: 'Invalid deadline date' });
          }
          if (deadlineDate < new Date()) {
            return res.status(400).json({ message: 'Deadline must be in the future' });
          }
        }
      }

      const updatedJob = await prisma.job.update({
        where: { id: jobId },
        data: {
          ...(title && { title: title.trim() }),
          ...(description && { description: description.trim() }),
          ...(deadline !== undefined && { deadline: deadlineDate }),
          ...(extraQuestions !== undefined && { extraQuestions })
        }
      });

      res.json(updatedJob);
    } catch (error) {
      console.error('Error updating job:', error);
      res.status(500).json({ message: 'Error updating job' });
    }
  }
);

// Delete job
router.delete(
  '/:id',
  authenticate,
  requireRole(['COMPANY']),
  async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const jobId = parseInt(req.params.id);

      // Get company from user
      const company = await prisma.company.findUnique({
        where: { userId: user.id }
      });

      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }

      // Check if job exists and belongs to company
      const existingJob = await prisma.job.findFirst({
        where: {
          id: jobId,
          companyId: company.id
        }
      });

      if (!existingJob) {
        return res.status(404).json({ message: 'Job not found' });
      }

      await prisma.job.delete({
        where: { id: jobId }
      });

      res.json({ message: 'Job deleted successfully' });
    } catch (error) {
      console.error('Error deleting job:', error);
      res.status(500).json({ message: 'Error deleting job' });
    }
  }
);

// Get public job details by ID (for candidates to apply)
router.get(
  '/public/:id',
  async (req: Request, res: Response) => {
    try {
      const jobId = parseInt(req.params.id);

      const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: {
          company: {
            select: { companyName: true }
          }
        }
      });

      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      res.json(job);
    } catch (error) {
      console.error('Error fetching job:', error);
      res.status(500).json({ message: 'Error fetching job' });
    }
  }
);

export default router;
