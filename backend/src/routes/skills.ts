import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

const skillSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
  description: z.string().optional(),
  type: z.enum(['teach', 'learn']),
});

// Create skill
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { name, category, level, description, type } = skillSchema.parse(req.body);

    const data: any = {
      name,
      category,
      level,
      description,
    };

    if (type === 'teach') {
      data.teacherId = req.userId;
    } else {
      data.teacherId = req.userId; // Required field
      data.learnerId = req.userId;
    }

    const skill = await prisma.skill.create({
      data,
    });

    res.status(201).json(skill);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create skill error:', error);
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

// Get user's skills
router.get('/my-skills', authenticate, async (req: AuthRequest, res) => {
  try {
    const [teachSkills, learnSkills] = await Promise.all([
      prisma.skill.findMany({
        where: {
          teacherId: req.userId,
          learnerId: null,
        },
      }),
      prisma.skill.findMany({
        where: {
          learnerId: req.userId,
        },
      }),
    ]);

    res.json({ teachSkills, learnSkills });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// Search skills for matching
router.get('/search', authenticate, async (req: AuthRequest, res) => {
  try {
    const { category, level, search } = req.query;

    const where: any = {
      teacherId: { not: req.userId },
      learnerId: null, // Only teaching skills
    };

    if (category) {
      where.category = category as string;
    }

    if (level) {
      where.level = level as string;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const skills = await prisma.skill.findMany({
      where,
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
      },
      take: 50,
    });

    res.json(skills);
  } catch (error) {
    console.error('Search skills error:', error);
    res.status(500).json({ error: 'Failed to search skills' });
  }
});

// Get skill categories
router.get('/categories', authenticate, async (req: AuthRequest, res) => {
  try {
    const categories = await prisma.skill.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
    });

    res.json(categories.map(c => c.category));
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Delete skill
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const skill = await prisma.skill.findUnique({
      where: { id: req.params.id },
    });

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    if (skill.teacherId !== req.userId && skill.learnerId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.skill.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

export default router;
