# SkillSwap Upgrade Instructions

## ⚠️ IMPORTANT: Run these commands in Command Prompt (not PowerShell)

## Step 1: Install Frontend Dependencies

```bash
cd c:\Users\yaswa\skillswap\frontend

# Core type definitions
npm install --save-dev @types/react @types/react-dom @types/node

# Modern UI components (Radix UI + utilities)
npm install @radix-ui/react-dropdown-menu @radix-ui/react-dialog @radix-ui/react-tooltip @radix-ui/react-avatar @radix-ui/react-select @radix-ui/react-switch

# UI utilities
npm install class-variance-authority clsx tailwind-merge

# Toast notifications
npm install react-hot-toast

# Date picker (for sessions)
npm install react-day-picker
```

## Step 2: Install Backend Security Packages

```bash
cd c:\Users\yaswa\skillswap\backend

# Security middleware
npm install express-rate-limit helmet

# CORS (if not already installed)
npm install cors
```

## Step 3: Verify Installation

```bash
# Check frontend
cd c:\Users\yaswa\skillswap\frontend
npm list class-variance-authority

# Check backend
cd ..\backend
npm list express-rate-limit
```

## Step 4: Start Development Servers

### Option A: Run Both Together
```bash
cd c:\Users\yaswa\skillswap
npm run dev
```

### Option B: Run Separately (Two Command Prompts)

**Terminal 1 - Backend:**
```bash
cd c:\Users\yaswa\skillswap\backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd c:\Users\yaswa\skillswap\frontend
npm run dev
```

## What's New?

### ✨ Modern UI Components
- **Button** - Variants: default, outline, ghost, destructive, secondary
- **Input** - Consistent styled inputs
- **Card** - Modern card components with header/content/footer
- **Dialog** - Modal dialogs for forms
- **Badge** - Status badges with color variants
- **Avatar** - User avatar component
- **Skeleton** - Loading placeholders
- **StarRating** - 5-star rating component
- **Toast** - Success/error notifications

### 🎯 New Features Implemented
- **Add Skill Dialog** - Add teaching/learning skills with category & level
- **Toast Notifications** - Global notification system
- **Utility Functions** - Date formatting, initials, duration helpers

### 📋 Features In Progress
Will be added next:
- Enhanced messaging with typing indicators & unread counts
- Session creation/management with calendar
- Review system UI
- Advanced discover filters
- Admin user management
- Dark mode support

## Troubleshooting

### PowerShell Script Execution Error
If you see: "running scripts is disabled on this system"
- Use **Command Prompt** instead of PowerShell
- Or run: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`

### Module Not Found Errors
These are normal before running `npm install`. After installation, restart your dev server.

### Type Errors in IDE
TypeScript errors will resolve after:
1. Running `npm install`
2. Restarting the dev server
3. Reloading your IDE window

## Next Steps

After installing dependencies:

1. Test the application - register/login
2. Try adding skills in your profile
3. Check the modern UI components
4. Look for toast notifications on actions

## Need Help?

- Check console for errors
- Verify all commands ran successfully
- Restart dev servers after installing packages
- Clear browser cache if UI looks broken

---

**Happy Coding! 🚀**
