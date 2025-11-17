import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Create job (company authenticated; here it's a placeholder)
router.post('/', async (req, res) => {
  const { title, description, deadline, companyId } = req.body;
  if (!title || !companyId) return res.status(400).json({ error: 'Missing fields' });
  try {
    const job = await prisma.job.create({ data: { title, description: description || '', deadline: deadline ? new Date(deadline) : undefined, companyId } });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// List jobs for a company
router.get('/company/:companyId', async (req, res) => {
  const { companyId } = req.params;
  const jobs = await prisma.job.findMany({ where: { companyId: Number(companyId) } });
  res.json(jobs);
});

export default router;
