# 📦 Complete Package Documentation - SkillSwap

## Table of Contents
1. [Backend Dependencies](#backend-dependencies)
2. [Backend Dev Dependencies](#backend-dev-dependencies)
3. [Frontend Dependencies](#frontend-dependencies)
4. [Frontend Dev Dependencies](#frontend-dev-dependencies)
5. [Quick Reference](#quick-reference)

---

# 🔧 Backend Dependencies

## Core Framework & Server

### **express** (^4.18.2)
- **Purpose:** Web application framework for Node.js
- **Why we use it:** Handles HTTP requests, routing, middleware
- **Used for:** All API endpoints, session management, routing
- **Example:** `app.get('/api/users', handler)`

### **socket.io** (^4.7.2)
- **Purpose:** Real-time bidirectional event-based communication
- **Why we use it:** Real-time messaging, typing indicators
- **Used for:** Messages page live chat, notifications
- **Example:** `io.on('connection', socket => {...})`

### **cors** (^2.8.5)
- **Purpose:** Cross-Origin Resource Sharing middleware
- **Why we use it:** Allows frontend (port 5173) to connect to backend (port 5000)
- **Used for:** Enabling API calls from React frontend
- **Example:** `app.use(cors({ origin: 'http://localhost:5173' }))`

---

## Security & Authentication

### **bcryptjs** (^2.4.3)
- **Purpose:** Password hashing library
- **Why we use it:** Securely store passwords, never plain text
- **Used for:** User registration, password verification
- **Example:** `const hash = await bcrypt.hash(password, 10)`

### **jsonwebtoken** (^9.0.2)
- **Purpose:** JSON Web Token implementation
- **Why we use it:** Stateless authentication, API authorization
- **Used for:** Login tokens, protected routes
- **Example:** `jwt.sign({ userId }, secret, { expiresIn: '7d' })`

### **helmet** (^8.1.0)
- **Purpose:** Security middleware for Express
- **Why we use it:** Sets security HTTP headers
- **Used for:** XSS protection, clickjacking prevention
- **Example:** `app.use(helmet())`

### **express-rate-limit** (^8.2.1)
- **Purpose:** Rate limiting middleware
- **Why we use it:** Prevent brute force attacks, API abuse
- **Used for:** Limiting login attempts, API requests
- **Example:** `limiter = rateLimit({ windowMs: 15*60*1000, max: 100 })`

---

## Database & ORM

### **@prisma/client** (^5.7.0)
- **Purpose:** Auto-generated type-safe database client
- **Why we use it:** Type-safe database queries, migrations
- **Used for:** All database operations (users, sessions, messages, etc.)
- **Example:** `await prisma.user.findUnique({ where: { email } })`

---

## External Integrations

### **axios** (^1.13.2)
- **Purpose:** Promise-based HTTP client
- **Why we use it:** Make HTTP requests to external APIs
- **Used for:** Daily.co video API calls, external services
- **Example:** `await axios.post(DAILY_API_URL, data)`

### **nodemailer** (^7.0.10)
- **Purpose:** Email sending library
- **Why we use it:** Send automated emails to users
- **Used for:** Welcome emails, session confirmations, review requests
- **Example:** `transporter.sendMail({ to, subject, html })`

---

## Utilities & Validation

### **dotenv** (^16.3.1)
- **Purpose:** Environment variable loader
- **Why we use it:** Load configuration from .env file
- **Used for:** Database URL, JWT secret, API keys
- **Example:** `process.env.DATABASE_URL`

### **zod** (^3.22.4)
- **Purpose:** TypeScript-first schema validation
- **Why we use it:** Validate request data, ensure type safety
- **Used for:** API request validation, data schemas
- **Example:** `const schema = z.object({ email: z.string().email() })`

---

# 🛠️ Backend Dev Dependencies

### **typescript** (^5.3.3)
- **Purpose:** JavaScript with static typing
- **Why we use it:** Type safety, better IDE support, fewer bugs
- **Used for:** All backend code
- **Example:** `interface User { id: string; email: string; }`

### **tsx** (^4.7.0)
- **Purpose:** TypeScript execution engine (replaces ts-node)
- **Why we use it:** Run TypeScript directly without compilation
- **Used for:** `npm run dev`, seed scripts
- **Example:** `tsx watch src/index.ts`

### **prisma** (^5.7.0)
- **Purpose:** Database toolkit and ORM
- **Why we use it:** Database schema, migrations, client generation
- **Used for:** Schema definition, database migrations
- **Example:** `npx prisma migrate dev`

### **@types/*** packages
- **@types/bcryptjs** - TypeScript types for bcryptjs
- **@types/cors** - TypeScript types for cors
- **@types/express** - TypeScript types for Express
- **@types/jsonwebtoken** - TypeScript types for JWT
- **@types/node** - TypeScript types for Node.js
- **@types/nodemailer** - TypeScript types for nodemailer
- **Purpose:** Provide TypeScript definitions for JavaScript libraries
- **Why we use them:** Enable IntelliSense, type checking, autocompletion

---

# ⚛️ Frontend Dependencies

## Core React Framework

### **react** (^18.2.0)
- **Purpose:** JavaScript library for building user interfaces
- **Why we use it:** Component-based UI, virtual DOM, state management
- **Used for:** Entire frontend application
- **Example:** `function Component() { return <div>Hello</div> }`

### **react-dom** (^18.2.0)
- **Purpose:** React rendering for web browsers
- **Why we use it:** Render React components to actual DOM
- **Used for:** `ReactDOM.render()`, DOM manipulation
- **Example:** `ReactDOM.createRoot(el).render(<App />)`

### **react-router-dom** (^6.20.1)
- **Purpose:** Routing library for React
- **Why we use it:** Navigate between pages, protected routes
- **Used for:** /login, /dashboard, /discover, /messages routes
- **Example:** `<Route path="/dashboard" element={<Dashboard />} />`

---

## State Management & Data Fetching

### **zustand** (^4.4.7)
- **Purpose:** Simple, fast state management
- **Why we use it:** Global state (user auth, app state)
- **Used for:** useAuthStore, user data persistence
- **Example:** `const { user } = useAuthStore()`

### **axios** (^1.6.2)
- **Purpose:** HTTP client for API requests
- **Why we use it:** Call backend API, handle responses
- **Used for:** All API calls (login, sessions, messages, etc.)
- **Example:** `await api.get('/api/users')`

---

## Real-Time Communication

### **socket.io-client** (^4.7.2)
- **Purpose:** WebSocket client for real-time features
- **Why we use it:** Real-time messaging, live updates
- **Used for:** Messages page chat, typing indicators
- **Example:** `socket.on('receive_message', handleMessage)`

---

## UI Components & Styling

### **@radix-ui/* packages**
- **@radix-ui/react-avatar** - Avatar component (user profile pics)
- **@radix-ui/react-dialog** - Modal dialogs (review dialog, session booking)
- **@radix-ui/react-dropdown-menu** - Dropdown menus (user menu)
- **@radix-ui/react-select** - Select dropdowns (filters)
- **@radix-ui/react-switch** - Toggle switches
- **@radix-ui/react-tooltip** - Tooltips
- **Purpose:** Unstyled, accessible UI primitives
- **Why we use them:** Accessible, customizable, follows best practices
- **Used for:** All UI components throughout the app

### **lucide-react** (^0.294.0)
- **Purpose:** Icon library (React components)
- **Why we use it:** Beautiful, consistent icons
- **Used for:** All icons (User, Calendar, Video, Star, etc.)
- **Example:** `<Calendar className="w-4 h-4" />`

### **tailwindcss** (^3.4.0) *(devDependency)*
- **Purpose:** Utility-first CSS framework
- **Why we use it:** Rapid UI development, consistent styling
- **Used for:** All styling via utility classes
- **Example:** `className="flex items-center gap-2 p-4"`

### **class-variance-authority** (^0.7.1)
- **Purpose:** CSS variant utility
- **Why we use it:** Dynamic component styles, variants
- **Used for:** Button variants (primary, outline, ghost)
- **Example:** `variant("primary", "outline", "ghost")`

### **clsx** (^2.1.1)
- **Purpose:** Conditional className utility
- **Why we use it:** Combine, toggle CSS classes
- **Used for:** Dynamic styling based on state
- **Example:** `clsx("base", { "active": isActive })`

### **tailwind-merge** (^2.6.0)
- **Purpose:** Merge Tailwind CSS classes intelligently
- **Why we use it:** Prevent conflicting Tailwind classes
- **Used for:** Component className props
- **Example:** `twMerge("p-4", props.className)`

---

## Date & Time

### **date-fns** (^3.0.6)
- **Purpose:** Modern date utility library
- **Why we use it:** Format dates, calculate differences
- **Used for:** Session dates, message timestamps
- **Example:** `format(date, 'PPP')` → "Jan 15, 2024"

### **react-day-picker** (^9.11.1)
- **Purpose:** Date picker component
- **Why we use it:** Select session dates in dialogs
- **Used for:** CreateSessionDialog date selection
- **Example:** `<DayPicker selected={date} onSelect={setDate} />`

---

## Notifications & Toast

### **react-hot-toast** (^2.6.0)
- **Purpose:** Toast notification library
- **Why we use it:** Show success/error messages
- **Used for:** "Session booked!", "Login failed" messages
- **Example:** `toast.success('Profile updated!')`

### **sonner** (^2.0.7)
- **Purpose:** Opinionated toast component
- **Why we use it:** Beautiful, accessible toasts (alternative to react-hot-toast)
- **Used for:** Custom toast notifications
- **Example:** `toast.promise(promise, { loading, success, error })`

---

## Video Integration

### **@daily-co/daily-js** (^0.85.0)
- **Purpose:** Daily.co video SDK (CURRENTLY NOT USED - using Jitsi instead)
- **Why we installed it:** Originally for video calls
- **Current status:** Switched to Jitsi Meet (free, no SDK needed)
- **Can remove:** Yes, not actively used

---

# 🔨 Frontend Dev Dependencies

### **vite** (^5.0.8)
- **Purpose:** Next-generation frontend build tool
- **Why we use it:** Fast dev server, hot module replacement
- **Used for:** Running dev server, building for production
- **Example:** `npm run dev` starts Vite dev server

### **@vitejs/plugin-react** (^4.2.1)
- **Purpose:** Vite plugin for React support
- **Why we use it:** Enable React JSX, fast refresh
- **Used for:** React development with Vite
- **Configuration:** In `vite.config.ts`

### **typescript** (^5.3.3)
- **Purpose:** JavaScript with static typing
- **Why we use it:** Type safety, better DX
- **Used for:** All frontend code
- **Example:** `interface User { name: string }`

### **@types/react** (^18.3.26)
- **Purpose:** TypeScript types for React
- **Why we use it:** Type checking for React APIs
- **Used for:** React.FC, useState, etc.

### **@types/react-dom** (^18.3.7)
- **Purpose:** TypeScript types for React DOM
- **Why we use it:** Type checking for ReactDOM
- **Used for:** ReactDOM.render types

### **autoprefixer** (^10.4.16)
- **Purpose:** PostCSS plugin to add vendor prefixes
- **Why we use it:** CSS compatibility across browsers
- **Used for:** Auto-add -webkit-, -moz- prefixes
- **Example:** `display: flex` → `-webkit-box-display: flex`

### **postcss** (^8.4.32)
- **Purpose:** CSS transformation tool
- **Why we use it:** Required by Tailwind CSS
- **Used for:** Process Tailwind directives
- **Configuration:** In `postcss.config.js`

### **@types/node** (^24.10.0)
- **Purpose:** TypeScript types for Node.js
- **Why we use it:** Import.meta.env, path utilities
- **Used for:** Environment variables, Vite config

---

# 📊 Package Summary

## Backend (12 dependencies)

| Category | Packages | Count |
|----------|----------|-------|
| **Framework** | express, socket.io, cors | 3 |
| **Security** | bcryptjs, jsonwebtoken, helmet, express-rate-limit | 4 |
| **Database** | @prisma/client | 1 |
| **External** | axios, nodemailer | 2 |
| **Utilities** | dotenv, zod | 2 |

## Frontend (23 dependencies)

| Category | Packages | Count |
|----------|----------|-------|
| **React Core** | react, react-dom, react-router-dom | 3 |
| **State** | zustand, axios | 2 |
| **Real-time** | socket.io-client | 1 |
| **UI Components** | @radix-ui/* (6 packages) | 6 |
| **Icons** | lucide-react | 1 |
| **Styling** | class-variance-authority, clsx, tailwind-merge | 3 |
| **Date/Time** | date-fns, react-day-picker | 2 |
| **Notifications** | react-hot-toast, sonner | 2 |
| **Video** | @daily-co/daily-js | 1 |
| **Utilities** | @types/node | 1 |

---

# 🎯 Package Installation Commands

## Install ALL Dependencies

### Backend:
```bash
cd backend
npm install
```

### Frontend:
```bash
cd frontend
npm install
```

---

## Install Individual Packages

### Add New Backend Package:
```bash
cd backend
npm install package-name
npm install --save-dev @types/package-name  # If types needed
```

### Add New Frontend Package:
```bash
cd frontend
npm install package-name
```

---

# 🔍 Quick Reference

## Most Important Packages

### Backend:
1. **express** - Web server framework
2. **@prisma/client** - Database ORM
3. **jsonwebtoken** - Authentication
4. **socket.io** - Real-time messaging
5. **nodemailer** - Email notifications

### Frontend:
1. **react** - UI framework
2. **react-router-dom** - Navigation
3. **zustand** - State management
4. **axios** - API calls
5. **socket.io-client** - Real-time chat
6. **tailwindcss** - Styling
7. **@radix-ui/** - UI components

---

# ⚠️ Unused/Optional Packages

## Can Be Removed:

### Frontend:
- **@daily-co/daily-js** - Not used (switched to Jitsi Meet)

### Both:
- **sonner** - Duplicate of react-hot-toast (choose one)

---

# 💡 Package Update Commands

## Check for Updates:
```bash
npm outdated
```

## Update All Packages:
```bash
npm update
```

## Update Specific Package:
```bash
npm install package-name@latest
```

---

# 🔒 Security

## Check for Vulnerabilities:
```bash
npm audit
```

## Fix Vulnerabilities:
```bash
npm audit fix
```

---

# 📝 Notes

## Package Version Symbols:

- **^** (caret) - Updates minor & patch (^1.2.3 allows 1.x.x)
- **~** (tilde) - Updates patch only (~1.2.3 allows 1.2.x)
- **exact** - No updates (1.2.3 only)

## Why We Use ^:
- Allows automatic patch & minor updates
- Gets bug fixes automatically
- Safe (semantic versioning)

---

# 🎓 Learning Resources

## Documentation Links:

- **Express:** https://expressjs.com/
- **React:** https://react.dev/
- **Prisma:** https://www.prisma.io/docs
- **Socket.IO:** https://socket.io/docs/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Radix UI:** https://www.radix-ui.com/primitives
- **Zustand:** https://github.com/pmndrs/zustand
- **Vite:** https://vitejs.dev/

---

**Total Packages: 35** (12 backend + 23 frontend)
**All Documented:** ✅
**Ready for Production:** ✅

---

*Last Updated: Phase 5 - Video & Email Integration Complete*
