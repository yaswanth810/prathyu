import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  sessionId: z.string(),
  revieweeId: z.string(),
});

// Create review
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { rating, comment, sessionId, revieweeId } = reviewSchema.parse(req.body);

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.teacherId !== req.userId && session.learnerId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const existingReview = await prisma.review.findUnique({
      where: { sessionId },
    });

    if (existingReview) {
      return res.status(400).json({ error: 'Session already reviewed' });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        sessionId,
        reviewerId: req.userId!,
        revieweeId,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    res.status(201).json(review);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Get reviews for a user
router.get('/user/:userId', authenticate, async (req: AuthRequest, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { revieweeId: req.params.userId },
      include: {
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        session: {
          select: {
            id: true,
            title: true,
            scheduledAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

export default router;
