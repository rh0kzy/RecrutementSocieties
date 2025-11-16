import express from 'express';
import { PrismaClient } from '@prisma/client';
import supabase from '../lib/supabase';

const prisma = new PrismaClient();
const router = express.Router();

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
