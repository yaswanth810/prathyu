# Install New Dependencies

Run these commands to add video chat and email features:

## Backend Dependencies

```bash
cd backend
npm install nodemailer axios
npm install --save-dev @types/nodemailer
```

## Frontend Dependencies

```bash
cd frontend
npm install @daily-co/daily-js
```

## Environment Variables to Add

### Backend (.env)
```env
# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Daily.co API (optional - for creating rooms)
DAILY_API_KEY=your-daily-api-key-optional
```

### Frontend (.env)
```env
# No additional env vars needed for Daily.co
```

## How to Get App-Specific Password for Gmail

1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to "App passwords"
4. Create new app password
5. Copy the 16-character password
6. Use it as EMAIL_PASSWORD

## Daily.co API Key (Optional)

For basic usage, you don't need an API key - just use public Daily.co rooms.
If you want to create private rooms:
1. Sign up at https://www.daily.co/
2. Go to Developers > API Keys
3. Copy your API key

**Note:** FREE tier gives you 10,000 minutes/month!
