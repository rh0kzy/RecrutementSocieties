import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import authRouter from './routes/auth.routes';
import jobRouter from './routes/job.routes';
import applicationRouter from './routes/application.routes';
import companyRouter from './routes/company.routes';

dotenv.config();
const prisma = new PrismaClient();
const app = express();

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to all routes
app.use(limiter);

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Body parsing middleware
app.use(express.json());

// Routes
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/jobs', jobRouter);
app.use('/api/applications', applicationRouter);
app.use('/api/companies', companyRouter);

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
