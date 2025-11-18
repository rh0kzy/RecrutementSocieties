import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../lib/jwt';
import { requireRole } from '../lib/validate';

const prisma = new PrismaClient();
const router = express.Router();

// Get candidate profile
router.get('/profile', authenticate, requireRole(['CANDIDATE']), async (req, res) => {
  try {
    const user = (req as any).user;
    const candidate = await prisma.candidate.findUnique({
      where: { userId: user.id },
      include: {
        user: {
          select: { email: true }
        }
      }
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate profile not found' });
    }

    res.json({
      id: candidate.id,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.user.email,
      profile: candidate.profile || {}
    });
  } catch (error) {
    console.error('Error fetching candidate profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update candidate profile
router.put('/profile', authenticate, requireRole(['CANDIDATE']), async (req, res) => {
  try {
    const user = (req as any).user;
    const { firstName, lastName, profile } = req.body;

    // Validate required fields
    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First name and last name are required' });
    }

    // Update candidate profile
    const updatedCandidate = await prisma.candidate.update({
      where: { userId: user.id },
      data: {
        firstName,
        lastName,
        profile: profile || {}
      },
      include: {
        user: {
          select: { email: true }
        }
      }
    });

    res.json({
      id: updatedCandidate.id,
      firstName: updatedCandidate.firstName,
      lastName: updatedCandidate.lastName,
      email: updatedCandidate.user.email,
      profile: updatedCandidate.profile || {}
    });
  } catch (error) {
    console.error('Error updating candidate profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;