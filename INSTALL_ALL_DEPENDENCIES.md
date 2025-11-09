# 📦 Install All Dependencies - Updated

## ✅ Package.json Files Updated!

Both `package.json` files have been updated to include all new packages for Phase 5 features:
- ✅ Email service (nodemailer)
- ✅ Video integration support (axios for API calls)
- ✅ Date handling (date-fns)
- ✅ Removed unused Daily.co package (using Jitsi instead)

---

## 🚀 Installation Commands

### **Step 1: Install Backend Dependencies**
```bash
cd backend
npm install
```

This will install:
- `nodemailer` (^6.9.15) - Email service
- `axios` (^1.7.0) - HTTP client for video API
- `date-fns` (^3.6.0) - Date utilities
- All existing packages

### **Step 2: Install Frontend Dependencies**
```bash
cd frontend
npm install
```

This will install:
- `date-fns` (^3.6.0) - Date formatting for sessions
- All existing React/UI packages
- **Note:** Removed `@daily-co/daily-js` (switched to Jitsi Meet - no SDK needed!)

---

## 📋 What Changed

### Backend package.json:
```json
{
  "dependencies": {
    "axios": "^1.7.0",           // ← Updated for video API
    "date-fns": "^3.6.0",        // ← NEW for date handling
    "nodemailer": "^6.9.15",     // ← NEW for emails
    // ... all existing packages
  },
  "devDependencies": {
    "@types/nodemailer": "^6.4.15"  // ← NEW for TypeScript
  }
}
```

### Frontend package.json:
```json
{
  "dependencies": {
    "date-fns": "^3.6.0",        // ← Updated for better date handling
    // REMOVED: "@daily-co/daily-js"  // Not needed (using Jitsi)
    // ... all existing packages
  }
}
```

---

## ⚡ Quick Install (Both at Once)

Run this from the root project folder:

```bash
# Install both backend and frontend
cd backend && npm install && cd ../frontend && npm install && cd ..
```

Or use PowerShell:
```powershell
# Backend
Set-Location backend; npm install; Set-Location ..

# Frontend  
Set-Location frontend; npm install; Set-Location ..
```

---

## 🔍 Verify Installation

After running `npm install`, check if packages are installed:

### Backend:
```bash
cd backend
npm list nodemailer axios date-fns
```

Should show:
```
├── nodemailer@6.9.15
├── axios@1.7.0
└── date-fns@3.6.0
```

### Frontend:
```bash
cd frontend
npm list date-fns
```

Should show:
```
└── date-fns@3.6.0
```

---

## 🎯 New Features These Packages Enable

### Backend:
- ✅ **nodemailer** → Send welcome emails, session confirmations, review requests
- ✅ **axios** → Make API calls to video services (Daily.co if needed)
- ✅ **date-fns** → Format dates in emails, calculate session times

### Frontend:
- ✅ **date-fns** → Display session dates beautifully, calculate durations

---

## ⚠️ Troubleshooting

### If `npm install` fails:

1. **Clear npm cache:**
```bash
npm cache clean --force
```

2. **Delete node_modules and package-lock.json:**
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

3. **Use specific Node version:**
```bash
# Check your Node version
node --version

# Should be 18.x or 20.x
# If not, update Node.js
```

### If you see "Cannot find module" errors:

```bash
# Reinstall the specific package
npm install nodemailer
npm install @types/nodemailer --save-dev
```

---

## 📊 Total Package Count

| Location | Before | After | Change |
|----------|--------|-------|--------|
| **Backend dependencies** | 11 | 13 | +2 (nodemailer, date-fns) |
| **Backend devDependencies** | 8 | 9 | +1 (@types/nodemailer) |
| **Frontend dependencies** | 23 | 22 | -1 (removed @daily-co) |

**Total:** 44 packages

---

## ✅ Installation Checklist

- [ ] Updated backend package.json ✅
- [ ] Updated frontend package.json ✅
- [ ] Run `npm install` in backend folder
- [ ] Run `npm install` in frontend folder
- [ ] No errors during installation
- [ ] Verify nodemailer installed (backend)
- [ ] Verify axios installed (backend)
- [ ] Verify date-fns installed (both)
- [ ] Run dev servers to test
- [ ] All features working

---

## 🚀 After Installation

### Start your servers:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Your app should now have:
- ✅ Email notifications
- ✅ Video chat (Jitsi Meet)
- ✅ Date formatting
- ✅ All existing features

---

## 💡 Pro Tip

Add this to your project README so others know what to install:

```markdown
## Installation

### Backend
\`\`\`bash
cd backend
npm install
\`\`\`

### Frontend
\`\`\`bash
cd frontend
npm install
\`\`\`
```

---

**Status:** ✅ Package.json files updated and ready!

**Next step:** Run `npm install` in both folders!
