# SkillSwap - Professional Skill Exchange Platform

A full-stack web application that enables users to exchange skills, schedule learning sessions, and connect with others in a community-driven learning environment.

## 🚀 Features

### Core Features
- **User Authentication** - Secure JWT-based signup/login system
- **User Profiles** - Manage skills to teach and learn with detailed profiles
- **Skill Discovery** - Advanced search and filtering to find teachers
- **Real-time Messaging** - Socket.io powered chat between users
- **Session Scheduling** - Book and manage learning sessions
- **Rating & Review System** - Rate sessions and build reputation
- **Admin Dashboard** - Platform management and analytics

### Technical Highlights
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Socket.io for instant messaging
- **Styling**: TailwindCSS with custom design system
- **State Management**: Zustand
- **API Client**: Axios with interceptors
- **Validation**: Zod schemas

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** 14+ database
- **Git** for version control

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd skillswap
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Database Setup

Create a PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE skillswap;
```

### 4. Environment Configuration

#### Backend (.env)

Create `backend/.env` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/skillswap?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Important**: Replace `username` and `password` with your PostgreSQL credentials.

#### Frontend (.env)

Create `frontend/.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Database Migration

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view database
npm run prisma:studio
```

### 6. Start Development Servers

#### Option 1: Run Both Servers Concurrently (Recommended)

From the root directory:

```bash
npm run dev
```

This starts both backend (port 5000) and frontend (port 5173) simultaneously.

#### Option 2: Run Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 7. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

## 📁 Project Structure

```
skillswap/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── routes/                # API route handlers
│   │   │   ├── auth.ts           # Authentication routes
│   │   │   ├── users.ts          # User management
│   │   │   ├── skills.ts         # Skill CRUD
│   │   │   ├── sessions.ts       # Session booking
│   │   │   ├── messages.ts       # Messaging system
│   │   │   ├── reviews.ts        # Review system
│   │   │   └── admin.ts          # Admin operations
│   │   ├── middleware/
│   │   │   └── auth.ts           # JWT authentication
│   │   ├── socket.ts             # Socket.io setup
│   │   └── index.ts              # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   │   └── Layout.tsx        # Main layout wrapper
│   │   ├── pages/                # Page components
│   │   │   ├── Home.tsx          # Landing page
│   │   │   ├── Login.tsx         # Login page
│   │   │   ├── Register.tsx      # Registration page
│   │   │   ├── Dashboard.tsx     # User dashboard
│   │   │   ├── Discover.tsx      # Skill discovery
│   │   │   ├── Messages.tsx      # Chat interface
│   │   │   ├── Sessions.tsx      # Session management
│   │   │   ├── Profile.tsx       # User profile
│   │   │   └── AdminDashboard.tsx # Admin panel
│   │   ├── lib/
│   │   │   ├── api.ts            # API client
│   │   │   └── socket.ts         # Socket.io client
│   │   ├── store/
│   │   │   └── authStore.ts      # Authentication state
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript types
│   │   ├── App.tsx               # Root component
│   │   ├── main.tsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── package.json
└── README.md
```

## 🔑 Default Admin Account

To create an admin account, register normally and then update the user role in the database:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update profile
- `GET /api/users/:id` - Get user by ID
- `GET /api/users` - Search users

### Skills
- `POST /api/skills` - Create skill
- `GET /api/skills/my-skills` - Get user's skills
- `GET /api/skills/search` - Search skills
- `GET /api/skills/categories` - Get categories
- `DELETE /api/skills/:id` - Delete skill

### Sessions
- `POST /api/sessions` - Create session
- `GET /api/sessions/my-sessions` - Get user's sessions
- `GET /api/sessions/:id` - Get session details
- `PATCH /api/sessions/:id/status` - Update session status
- `DELETE /api/sessions/:id` - Delete session

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/conversations` - Get conversations
- `GET /api/messages/:userId` - Get messages with user
- `PATCH /api/messages/:userId/read` - Mark as read

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/user/:userId` - Get user reviews

### Admin (Requires Admin Role)
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user
- `PATCH /api/admin/users/:id/role` - Update user role

## 🔌 Socket.io Events

### Client → Server
- `send_message` - Send a message
- `typing` - User is typing
- `stop_typing` - User stopped typing

### Server → Client
- `new_message` - Receive new message
- `message_sent` - Message sent confirmation
- `user_typing` - User is typing notification
- `user_stop_typing` - User stopped typing

## 🚢 Deployment

### Backend Deployment (Heroku Example)

1. Create a Heroku app:
```bash
heroku create skillswap-api
```

2. Add PostgreSQL addon:
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

3. Set environment variables:
```bash
heroku config:set JWT_SECRET="your-production-secret"
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL="https://your-frontend-url.com"
```

4. Deploy:
```bash
git subtree push --prefix backend heroku main
```

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `dist` folder to Vercel or Netlify

3. Set environment variable:
```
VITE_API_URL=https://your-backend-url.com/api
```

### Database Migration in Production

```bash
cd backend
npx prisma migrate deploy
```

## 🧪 Testing

```bash
# Backend tests (when implemented)
cd backend
npm test

# Frontend tests (when implemented)
cd frontend
npm test
```

## 🛡️ Security Considerations

- **JWT Tokens**: Stored in localStorage, expires in 7 days
- **Password Hashing**: Bcrypt with salt rounds of 10
- **CORS**: Configured for specific frontend origin
- **Input Validation**: Zod schemas on all endpoints
- **SQL Injection**: Protected by Prisma ORM
- **XSS**: React's built-in protection

## 📝 Development Tips

### Adding New Features

1. **Backend**: Create route in `backend/src/routes/`
2. **Frontend**: Create page in `frontend/src/pages/`
3. **Database**: Update `backend/prisma/schema.prisma` and run migration
4. **Types**: Update `frontend/src/types/index.ts`

### Database Schema Changes

```bash
cd backend

# Create migration
npx prisma migrate dev --name your_migration_name

# Generate Prisma Client
npm run prisma:generate
```

### Debugging

- **Backend logs**: Check terminal running backend server
- **Frontend logs**: Check browser console (F12)
- **Database**: Use Prisma Studio (`npm run prisma:studio`)
- **API Testing**: Use Postman or Thunder Client

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React Team for the amazing framework
- Prisma for the excellent ORM
- TailwindCSS for the utility-first CSS
- Socket.io for real-time capabilities

## 📧 Support

For issues and questions:
- Open an issue on GitHub
- Email: support@skillswap.com (if applicable)

---

**Built with ❤️ for the learning community**
