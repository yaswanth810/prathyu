import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { z } from 'zod';
import { videoService } from '../services/videoService';
import { emailService } from '../services/emailService';
import { format } from 'date-fns';

const router = express.Router();
const prisma = new PrismaClient();

const sessionSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  scheduledAt: z.string().datetime(),
  duration: z.number().min(15).max(480),
  teacherId: z.string().optional(),
  learnerId: z.string().optional(),
  meetingLink: z.string().url().optional(),
});

// Create session
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const data = sessionSchema.parse(req.body);

    // Generate video meeting link if not provided
    let meetingLink = data.meetingLink;
    if (!meetingLink) {
      try {
        meetingLink = videoService.generatePublicRoomUrl(Date.now().toString());
      } catch (error) {
        console.error('Failed to generate video link:', error);
      }
    }

    const session = await prisma.session.create({
      data: {
        title: data.title,
        description: data.description,
        scheduledAt: new Date(data.scheduledAt),
        duration: data.duration,
        teacherId: data.teacherId || req.userId!,
        learnerId: data.learnerId || req.userId!,
        meetingLink: meetingLink,
      },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        learner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    res.status(201).json(session);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create session error:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Get user's sessions
router.get('/my-sessions', authenticate, async (req: AuthRequest, res) => {
  try {
    const { status, upcoming } = req.query;

    const where: any = {
      OR: [
        { teacherId: req.userId },
        { learnerId: req.userId },
      ],
    };

    if (status) {
      where.status = status as string;
    }

    if (upcoming === 'true') {
      where.scheduledAt = { gte: new Date() };
    }

    const sessions = await prisma.session.findMany({
      where,
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        learner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        review: true,
      },
      orderBy: { scheduledAt: 'desc' },
    });

    res.json(sessions);
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Get session by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const session = await prisma.session.findUnique({
      where: { id: req.params.id },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
          },
        },
        learner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
          },
        },
        review: true,
      },
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.teacherId !== req.userId && session.learnerId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(session);
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Update session status
router.patch('/:id/status', authenticate, async (req: AuthRequest, res) => {
  try {
    const { status } = z.object({
      status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']),
    }).parse(req.body);

    const session = await prisma.session.findUnique({
      where: { id: req.params.id },
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.teacherId !== req.userId && session.learnerId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedSession = await prisma.session.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            email: true,
          },
        },
        learner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            email: true,
          },
        },
      },
    });

    // Send emails based on status change (non-blocking)
    if (status === 'CONFIRMED') {
      // Send confirmation email to student
      const dateStr = format(new Date(updatedSession.scheduledAt), 'PPP p');
      emailService.sendSessionConfirmation(
        updatedSession.learner.email,
        updatedSession.learner.firstName,
        updatedSession.teacher.firstName,
        updatedSession.title,
        dateStr,
        updatedSession.meetingLink || undefined
      ).catch(err => console.error('Confirmation email failed:', err));
    } else if (status === 'COMPLETED') {
      // Send review request to student
      emailService.sendReviewRequest(
        updatedSession.learner.email,
        updatedSession.learner.firstName,
        updatedSession.teacher.firstName,
        updatedSession.title
      ).catch(err => console.error('Review request email failed:', err));
    }

    res.json(updatedSession);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update session error:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

// Delete session
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const session = await prisma.session.findUnique({
      where: { id: req.params.id },
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.teacherId !== req.userId && session.learnerId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.session.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

export default router;
