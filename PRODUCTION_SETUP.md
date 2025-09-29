# Production Deployment Setup Guide 🚀

## Current Issue
The build is failing because Supabase environment variables are missing, causing the app to use mock clients during build time. This creates TypeScript errors that prevent successful deployment.

## Solution: Set Up Supabase Environment Variables

### Step 1: Create Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `stufd-boilerplate` (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (2-3 minutes)

### Step 2: Get Environment Variables
Once your project is ready:

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)

### Step 3: Create Environment File
Create a `.env.local` file in your project root with these variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# NextAuth Configuration
AUTH_SECRET=your_auth_secret_here
NEXTAUTH_URL=https://your-domain.com

# Database Configuration (use Supabase connection string)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_SIGNIN_ENABLED=true
```

### Step 4: Generate Required Secrets
Generate the required secrets:

```bash
# Generate AUTH_SECRET
openssl rand -base64 32

# Generate SESSION_SECRET (if needed)
openssl rand -base64 32
```

### Step 5: Set Up Database Schema
The project uses Drizzle ORM. You'll need to:

1. Run the database migrations:
   ```bash
   pnpm db:push
   ```

2. Or manually create the required tables in Supabase SQL Editor

### Step 6: Configure Vercel (if deploying to Vercel)
1. Go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add all the environment variables from your `.env.local` file
4. Make sure to set them for **Production**, **Preview**, and **Development**

### Step 7: Test the Build
After setting up the environment variables:

```bash
pnpm build
```

This should now complete successfully without TypeScript errors.

## Alternative: Quick Fix for Development
If you want to quickly test the build without setting up Supabase:

1. Create a `.env.local` file with dummy values:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://dummy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy_key
AUTH_SECRET=dummy_secret
DATABASE_URL=postgresql://dummy:dummy@dummy:5432/dummy
```

2. The app will use the real Supabase client but with dummy credentials (will show empty data)

## Production Checklist ✅
- [ ] Supabase project created
- [ ] Environment variables configured
- [ ] Database schema set up
- [ ] Build completes successfully
- [ ] Deployed to production platform
- [ ] Environment variables set in production platform

## Troubleshooting
- **Build still failing?** Check that all environment variables are properly set
- **Database errors?** Ensure the database schema is properly migrated
- **Auth errors?** Verify AUTH_SECRET is set and matches between environments
