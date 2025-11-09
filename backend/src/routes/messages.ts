import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

const messageSchema = z.object({
  content: z.string().min(1),
  receiverId: z.string(),
});

// Send message
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { content, receiverId } = messageSchema.parse(req.body);

    const message = await prisma.message.create({
      data: {
        content,
        senderId: req.userId!,
        receiverId,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    res.status(201).json(message);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get conversations
router.get('/conversations', authenticate, async (req: AuthRequest, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.userId },
          { receiverId: req.userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Group by conversation partner
    const conversationsMap = new Map();

    messages.forEach(message => {
      const partnerId = message.senderId === req.userId 
        ? message.receiverId 
        : message.senderId;
      
      if (!conversationsMap.has(partnerId)) {
        const partner = message.senderId === req.userId 
          ? message.receiver 
          : message.sender;
        
        conversationsMap.set(partnerId, {
          partner,
          lastMessage: message,
          unreadCount: 0,
        });
      }

      if (message.receiverId === req.userId && !message.read) {
        const conv = conversationsMap.get(partnerId);
        conv.unreadCount++;
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get messages with a specific user
router.get('/:userId', authenticate, async (req: AuthRequest, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.userId, receiverId: req.params.userId },
          { senderId: req.params.userId, receiverId: req.userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        senderId: req.params.userId,
        receiverId: req.userId,
        read: false,
      },
      data: { read: true },
    });

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Mark messages as read
router.patch('/:userId/read', authenticate, async (req: AuthRequest, res) => {
  try {
    await prisma.message.updateMany({
      where: {
        senderId: req.params.userId,
        receiverId: req.userId,
        read: false,
      },
      data: { read: true },
    });

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

export default router;
