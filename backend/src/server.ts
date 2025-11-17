import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRouter from './routes/auth.routes';
import jobRouter from './routes/job.routes';
import applicationRouter from './routes/application.routes';

dotenv.config();
const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/jobs', jobRouter);
app.use('/api/applications', applicationRouter);

app.get('/health', async (req, res) => {
  res.json({ status: 'ok' });
});

// Basic route placeholder
app.get('/', (req, res) => {
  res.json({ message: 'Recruitment SaaS backend is running' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
