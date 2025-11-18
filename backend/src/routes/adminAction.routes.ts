import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest, requireRole } from '../lib/jwt';

const router = Router();
const prisma = new PrismaClient();

// Get all admin actions (paginated)
router.get('/all', authenticate, requireRole(['ADMIN']), async (req: AuthRequest, res) => {
  try {
    const { page = '1', limit = '20', search = '' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause for search
    const where: any = {};
    if (search) {
      where.OR = [
        { action: { contains: search as string, mode: 'insensitive' } },
        { details: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    // Fetch actions and total count in parallel
    const [actions, total] = await Promise.all([
      prisma.adminAction.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          admin: {
            include: {
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      }),
      prisma.adminAction.count({ where }),
    ]);

    res.json({
      actions,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching admin actions:', error);
    res.status(500).json({ error: 'Failed to fetch admin actions' });
  }
});

// Create admin action log
router.post('/', authenticate, requireRole(['ADMIN']), async (req: AuthRequest, res) => {
  try {
    const { action, details } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get admin ID from user ID
    const admin = await prisma.admin.findUnique({
      where: { userId },
    });

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const adminAction = await prisma.adminAction.create({
      data: {
        adminId: admin.id,
        action,
        details,
      },
    });

    res.status(201).json(adminAction);
  } catch (error) {
    console.error('Error creating admin action:', error);
    res.status(500).json({ error: 'Failed to create admin action' });
  }
});

export default router;
