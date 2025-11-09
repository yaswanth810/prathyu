# Deployment Guide for SkillSwap

This guide covers deploying SkillSwap to production environments.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Database Setup](#database-setup)
5. [Environment Variables](#environment-variables)
6. [Post-Deployment](#post-deployment)

## Prerequisites

- Git repository with your code
- PostgreSQL database (Railway, Supabase, or Heroku Postgres)
- Hosting accounts (Heroku, Railway, Render for backend; Vercel, Netlify for frontend)

## Backend Deployment

### Option 1: Railway (Recommended)

1. **Create Railway Account**: https://railway.app

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend` directory

3. **Add PostgreSQL Database**:
   - Click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically set `DATABASE_URL`

4. **Configure Environment Variables**:
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-production-key-min-32-chars
   PORT=5000
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

5. **Configure Build Settings**:
   - Root Directory: `/backend`
   - Build Command: `npm install && npm run build && npx prisma generate && npx prisma migrate deploy`
   - Start Command: `npm start`

6. **Deploy**: Railway will auto-deploy on push to main branch

### Option 2: Heroku

1. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App**:
   ```bash
   heroku login
   heroku create skillswap-api
   ```

3. **Add PostgreSQL**:
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

4. **Set Environment Variables**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET="your-secret-key"
   heroku config:set FRONTEND_URL="https://your-frontend.vercel.app"
   ```

5. **Create Procfile** in backend directory:
   ```
   web: npm start
   release: npx prisma migrate deploy
   ```

6. **Deploy**:
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Option 3: Render

1. **Create Render Account**: https://render.com

2. **Create New Web Service**:
   - Connect your GitHub repository
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build && npx prisma generate`
   - Start Command: `npm start`

3. **Add PostgreSQL Database**:
   - Create new PostgreSQL database in Render
   - Copy the Internal Database URL

4. **Set Environment Variables**:
   ```
   DATABASE_URL=<your-render-postgres-url>
   NODE_ENV=production
   JWT_SECRET=your-secret-key
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

5. **Deploy**: Render will auto-deploy

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy from CLI**:
   ```bash
   cd frontend
   vercel
   ```

3. **Or Deploy via Dashboard**:
   - Go to https://vercel.com
   - Import your GitHub repository
   - Configure:
     - Framework Preset: Vite
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `dist`

4. **Set Environment Variable**:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

5. **Deploy**: Vercel will auto-deploy on push

### Option 2: Netlify

1. **Create netlify.toml** in frontend directory:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy via Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   cd frontend
   netlify deploy --prod
   ```

3. **Or Deploy via Dashboard**:
   - Go to https://netlify.com
   - Drag and drop the `dist` folder
   - Or connect GitHub repository

4. **Set Environment Variable**:
   - Site settings → Environment variables
   - Add: `VITE_API_URL=https://your-backend-url.railway.app/api`

## Database Setup

### Supabase (Managed PostgreSQL)

1. **Create Project**: https://supabase.com

2. **Get Connection String**:
   - Project Settings → Database
   - Copy the connection string
   - Format: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

3. **Update Backend .env**:
   ```
   DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?pgbouncer=true"
   ```

4. **Run Migrations**:
   ```bash
   cd backend
   npx prisma migrate deploy
   ```

### Railway PostgreSQL

1. **Add Database to Project**:
   - In Railway dashboard, click "+ New"
   - Select "Database" → "PostgreSQL"

2. **Connection String**:
   - Railway automatically sets `DATABASE_URL`
   - No manual configuration needed

3. **Run Migrations**:
   - Add to build command: `npx prisma migrate deploy`

## Environment Variables

### Backend Production Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Server
NODE_ENV=production
PORT=5000

# Security
JWT_SECRET="minimum-32-character-secret-key-for-production"

# CORS
FRONTEND_URL="https://your-frontend-domain.vercel.app"
```

### Frontend Production Variables

```env
VITE_API_URL=https://your-backend-domain.railway.app/api
```

## Post-Deployment

### 1. Test the Deployment

```bash
# Test backend health
curl https://your-backend-url.railway.app/api/health

# Test frontend
open https://your-frontend-url.vercel.app
```

### 2. Create Admin User

```bash
# Connect to production database
psql $DATABASE_URL

# Update user role
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

### 3. Monitor Logs

**Railway**:
- Dashboard → Your Service → Logs

**Heroku**:
```bash
heroku logs --tail
```

**Vercel**:
- Dashboard → Your Project → Deployments → View Function Logs

### 4. Set Up Custom Domain (Optional)

**Vercel**:
- Project Settings → Domains → Add Domain

**Railway**:
- Service Settings → Networking → Custom Domain

### 5. Enable HTTPS

Both Vercel and Railway provide automatic HTTPS certificates.

## Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          # Add Railway deployment commands

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          # Add Vercel deployment commands
```

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL

# Check Prisma
cd backend
npx prisma db push
```

### CORS Errors

- Ensure `FRONTEND_URL` in backend matches your frontend domain
- Check that frontend `VITE_API_URL` is correct

### Build Failures

```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Migration Issues

```bash
# Reset database (CAUTION: Deletes all data)
npx prisma migrate reset

# Or manually run migrations
npx prisma migrate deploy
```

## Performance Optimization

### Backend
- Enable compression middleware
- Add Redis for caching (optional)
- Use connection pooling for database

### Frontend
- Enable Vercel Analytics
- Add lazy loading for routes
- Optimize images

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Enable HTTPS only
- [ ] Set secure CORS origins
- [ ] Enable rate limiting
- [ ] Regular security updates
- [ ] Database backups enabled
- [ ] Environment variables secured

## Backup Strategy

### Database Backups

**Railway**:
- Automatic daily backups included

**Heroku**:
```bash
heroku pg:backups:capture
heroku pg:backups:download
```

**Manual Backup**:
```bash
pg_dump $DATABASE_URL > backup.sql
```

## Scaling

### Backend Scaling
- Railway: Adjust resources in dashboard
- Heroku: `heroku ps:scale web=2`

### Database Scaling
- Upgrade to higher tier plans
- Enable connection pooling
- Add read replicas

## Cost Estimation

### Free Tier (Development)
- Railway: $5 credit/month
- Vercel: Unlimited deployments
- Supabase: 500MB database

### Production (Estimated)
- Railway: ~$10-20/month
- Vercel Pro: $20/month
- Database: $10-25/month

**Total**: ~$40-65/month for production-ready setup

## Support

For deployment issues:
- Railway: https://railway.app/help
- Vercel: https://vercel.com/support
- Heroku: https://help.heroku.com

---

**Last Updated**: 2024
