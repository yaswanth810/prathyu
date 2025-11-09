import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthSocket extends Socket {
  userId?: string;
}

export const initializeSocket = (io: Server) => {
  // Authentication middleware
  io.use((socket: AuthSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
      };
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthSocket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join user's personal room
    socket.join(`user:${socket.userId}`);

    // Handle sending messages
    socket.on('send_message', async (data: {
      receiverId: string;
      content: string;
    }) => {
      try {
        const message = await prisma.message.create({
          data: {
            content: data.content,
            senderId: socket.userId!,
            receiverId: data.receiverId,
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

        // Send to receiver
        io.to(`user:${data.receiverId}`).emit('new_message', message);
        
        // Send confirmation to sender
        socket.emit('message_sent', message);
      } catch (error) {
        console.error('Socket message error:', error);
        socket.emit('message_error', { error: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data: { receiverId: string }) => {
      io.to(`user:${data.receiverId}`).emit('user_typing', {
        userId: socket.userId,
      });
    });

    socket.on('stop_typing', (data: { receiverId: string }) => {
      io.to(`user:${data.receiverId}`).emit('user_stop_typing', {
        userId: socket.userId,
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
};
