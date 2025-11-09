import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().url().optional().nullable(),
});

// Get current user profile
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        role: true,
        createdAt: true,
        skillsToTeach: true,
        skillsToLearn: true,
        _count: {
          select: {
            sessionsAsTeacher: true,
            sessionsAsLearner: true,
            receivedReviews: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate average rating
    const reviews = await prisma.review.findMany({
      where: { revieweeId: req.userId },
      select: { rating: true },
    });

    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({ ...user, averageRating });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update profile
router.put('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const data = updateProfileSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.userId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        role: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        createdAt: true,
        skillsToTeach: true,
        _count: {
          select: {
            sessionsAsTeacher: true,
            receivedReviews: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate average rating
    const reviews = await prisma.review.findMany({
      where: { revieweeId: req.params.id },
      select: { rating: true },
    });

    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({ ...user, averageRating });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Search users
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { search, skill, page = '1', limit = '10' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {
      id: { not: req.userId }, // Exclude current user
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { bio: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (skill) {
      where.skillsToTeach = {
        some: {
          name: { contains: skill as string, mode: 'insensitive' },
        },
      };
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
          bio: true,
          skillsToTeach: {
            select: {
              id: true,
              name: true,
              category: true,
              level: true,
            },
          },
        },
        skip,
        take: parseInt(limit as string),
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
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

export default router;
