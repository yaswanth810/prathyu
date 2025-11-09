export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  averageRating?: number;
  skillsToTeach?: Skill[];
  skillsToLearn?: Skill[];
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description?: string;
  teacherId: string;
  learnerId?: string;
  teacher?: User;
  createdAt: string;
}

export interface Session {
  id: string;
  title: string;
  description?: string;
  scheduledAt: string;
  duration: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  meetingLink?: string;
  teacherId: string;
  learnerId: string;
  teacher: User;
  learner: User;
  review?: Review;
  createdAt: string;
}

export interface Message {
  id: string;
  content: string;
  read: boolean;
  senderId: string;
  receiverId: string;
  sender: User;
  receiver: User;
  createdAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  sessionId: string;
  reviewerId: string;
  revieweeId: string;
  reviewer: User;
  session?: Session;
  createdAt: string;
}

export interface Conversation {
  partner: User;
  lastMessage: Message;
  unreadCount: number;
}
