# Admin Account Setup Guide 🛡️

## Quick Setup - Create Admin User

I've created a seed script to automatically create an admin account for you.

### Method 1: Run Seed Script (Recommended)

**Open Command Prompt** and run:

```bash
cd c:\Users\yaswa\skillswap\backend
npm run prisma:seed
```

This will create an admin account with these credentials:

```
📧 Email: admin@skillswap.com
🔑 Password: admin123
```

---

## Login as Admin

1. Go to http://localhost:5173/login
2. Enter:
   - **Email:** `admin@skillswap.com`
   - **Password:** `admin123`
3. Click "Login"
4. You should be redirected to the Dashboard
5. Click "Admin" in the navigation to access the Admin Dashboard

---

## Test Admin Features

Once logged in as admin:

### 1. View Statistics
- See platform overview with 5 stat cards
- Total users, sessions, skills, messages, reviews
- Growth percentages

### 2. Manage Users
- Search users by name or email
- Promote users to admin (click "Make Admin")
- Demote admins to user (click "Remove Admin")
- Delete users (with confirmation)

### 3. Test Workflow
```
1. Register a test user (e.g., test@test.com)
2. Login as admin
3. Go to Admin Dashboard
4. Search for "test"
5. Click "Make Admin" on test user
6. See role badge change to ADMIN with shield icon
7. Click "Remove Admin" to demote back
8. Click Delete (red button) to remove user
```

---

## Method 2: Manual Database Update (Alternative)

If the seed script doesn't work, you can manually update the database:

### Using Prisma Studio:
```bash
cd c:\Users\yaswa\skillswap\backend
npm run prisma:studio
```

1. Browser opens at http://localhost:5555
2. Click on "User" table
3. Find your user account
4. Click to edit
5. Change `role` from `USER` to `ADMIN`
6. Click "Save 1 change"

### Using SQL (Advanced):
```bash
cd c:\Users\yaswa\skillswap\backend
psql -U postgres -d skillswap
```

Then run:
```sql
-- Update existing user to admin
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';

-- Or create new admin user (replace with your hashed password)
INSERT INTO "User" (id, email, password, "firstName", "lastName", role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@skillswap.com',
  '$2a$10$YourHashedPasswordHere',
  'Admin',
  'User',
  'ADMIN',
  NOW(),
  NOW()
);
```

---

## Method 3: Create via Registration + Manual Update

1. **Register normally** at http://localhost:5173/register
   - Use any email/password
   - Fill in first name, last name
   - Click "Sign Up"

2. **Update to admin** using Prisma Studio:
   ```bash
   cd c:\Users\yaswa\skillswap\backend
   npm run prisma:studio
   ```
   - Open User table
   - Find your user
   - Change role to ADMIN
   - Save

3. **Logout and login again** to see admin features

---

## Verify Admin Access

After logging in, you should see:

✅ **Admin** link in the navigation bar
✅ Access to `/admin` route
✅ User management features
✅ Platform statistics
✅ Shield icon next to your role

If you **don't** see the Admin link:
- Check that role is set to `ADMIN` in database
- Try logging out and back in
- Clear browser cache/localStorage

---

## Security Notes

⚠️ **IMPORTANT:**

1. **Change default password** after first login
2. **Never use** `admin123` in production
3. **Limit admin accounts** to trusted users only
4. **Monitor admin actions** regularly
5. **Use strong passwords** for admin accounts

---

## Troubleshooting

### Seed script fails:
```bash
# Make sure dependencies are installed
cd c:\Users\yaswa\skillswap\backend
npm install

# Try running migrations first
npm run prisma:migrate

# Then run seed
npm run prisma:seed
```

### "Admin already exists" message:
- The admin account is already created
- Just use the credentials to login
- If you forgot password, use Method 2 to update it

### Can't access /admin route:
- Make sure role is `ADMIN` (not `USER`)
- Check browser console for errors
- Verify JWT token includes role field
- Try logging out and back in

### Database connection error:
```bash
# Check PostgreSQL is running
# Verify .env file has correct DATABASE_URL
# Test connection:
cd backend
npm run prisma:studio
```

---

## Creating Additional Admins

Once you're logged in as admin:

1. Have the user register normally
2. Login to Admin Dashboard
3. Search for the user
4. Click "Make Admin"
5. User will have admin access on next login

---

## Admin Credentials Summary

**Default Admin Account:**
```
Email:    admin@skillswap.com
Password: admin123
Role:     ADMIN
```

**Remember to:**
- [ ] Run seed script to create admin
- [ ] Login with credentials
- [ ] Change password after first login
- [ ] Test admin features
- [ ] Create additional admins as needed

---

## Next Steps

After logging in as admin:

1. ✅ Test Admin Dashboard features
2. ✅ Manage test users
3. ✅ Continue with Phase 4 implementation
4. ✅ Deploy platform
5. ✅ Change admin password in production

---

**Ready to test!** Run the seed script and login as admin to explore the admin dashboard features I just built! 🚀
