import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Company register (placeholder - password hashing and create company in DB)
router.post('/company/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  const hashed = await bcrypt.hash(password, 10);
  try {
    const company = await prisma.company.create({ data: { name, email, password: hashed } });
    res.json({ companyId: company.id });
  } catch (err) {
    res.status(400).json({ error: 'Unable to create company' });
  }
});

// Candidate register placeholder
router.post('/candidate/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const hashed = await bcrypt.hash(password, 10);
  try {
    const candidate = await prisma.candidate.create({ data: { email, password: hashed } });
    res.json({ candidateId: candidate.id });
  } catch (err) {
    res.status(400).json({ error: 'Unable to create candidate' });
  }
});

// Basic login route for both companies and candidates
router.post('/login', async (req, res) => {
  const { email, password, type } = req.body; // type: 'company'|'candidate'|'admin'
  if (!email || !password || !type) return res.status(400).json({ error: 'Missing fields' });
  try {
    let account: any;
    if (type === 'company') account = await prisma.company.findUnique({ where: { email } });
    if (type === 'candidate') account = await prisma.candidate.findUnique({ where: { email } });
    if (type === 'admin') account = await prisma.admin.findUnique({ where: { email } });
    if (!account) return res.status(404).json({ error: 'Account not found' });
    const match = await bcrypt.compare(password, account.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: account.id, type }, process.env.JWT_SECRET || 'change_me', { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
