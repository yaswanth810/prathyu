import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest, isAdmin } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get dashboard stats
router.get('/stats', authenticate, isAdmin, async (req: AuthRequest, res) => {
  try {
    const [
      totalUsers,
      totalSessions,
      totalSkills,
      totalMessages,
      totalReviews,
      recentUsers,
      recentSessions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.session.count(),
      prisma.skill.count(),
      prisma.message.count(),
      prisma.review.count(),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          role: true,
        },
      }),
      prisma.session.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          teacher: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          learner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
    ]);

    res.json({
      stats: {
        totalUsers,
        totalSessions,
        totalSkills,
        totalMessages,
        totalReviews,
      },
      recentUsers,
      recentSessions,
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get all users with pagination
router.get('/users', authenticate, isAdmin, async (req: AuthRequest, res) => {
  try {
    const { page = '1', limit = '20', search } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: search as string, mode: 'insensitive' } },
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              sessionsAsTeacher: true,
              sessionsAsLearner: true,
              skillsToTeach: true,
            },
          },
        },
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Delete user
router.delete('/users/:id', authenticate, isAdmin, async (req: AuthRequest, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Update user role
router.patch('/users/:id/role', authenticate, isAdmin, async (req: AuthRequest, res) => {
  try {
    const { role } = req.body;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

export default router;
