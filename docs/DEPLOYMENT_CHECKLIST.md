# Vercel Deployment Checklist ✅

## Pre-Deployment Setup

### 🔴 **CRITICAL - Must be set for deployment to work:**

1. **Database Connection**
   - Set `DATABASE_URL` in Vercel environment variables
   - Use a PostgreSQL database (Neon, Supabase, Railway, etc.)
   - Format: `postgresql://username:password@host:port/database`

2. **App URL**
   - Set `NEXT_PUBLIC_APP_URL` to your production domain
   - Example: `https://your-app.vercel.app`

3. **Authentication Secrets**
   - Set `AUTH_SECRET` (generate with: `openssl rand -base64 32`)
   - Set `SESSION_SECRET` (generate with: `openssl rand -base64 32`)

4. **NextAuth Configuration**
   - Set `NEXTAUTH_URL` to your production domain
   - Usually same as `NEXT_PUBLIC_APP_URL`

### 🟡 **RECOMMENDED - For better functionality:**

5. **Google OAuth** (Optional but recommended)
   - Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
   - Configure OAuth redirect URLs in Google Cloud Console

6. **Sign-in Control** (Optional)
   - Set `NEXT_PUBLIC_SIGNIN_ENABLED=true` to enable sign-in

7. **Super Admin** (Optional)
   - Set `SUPER_ADMIN_EMAILS` with comma-separated admin emails

### 🟢 **OPTIONAL - Payment integrations (can be added later):**

- Stripe keys (`STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`)
- DodoPayments keys (`DODO_PAYMENTS_API_URL`, `DODO_PAYMENTS_API_KEY`)
- PayPal keys (`PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`)
- LemonSqueezy keys (`LEMONSQUEEZY_API_KEY`, `LEMONSQUEEZY_STORE_ID`)

## Deployment Steps

1. **Set Environment Variables in Vercel:**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add all required variables from the checklist above

2. **Deploy:**
   - Push your code to the connected Git repository
   - Vercel will automatically build and deploy

3. **Verify Deployment:**
   - Check that the app loads without errors
   - Test sign-in functionality (if enabled)
   - Verify database connection works

## Troubleshooting

### Build Fails
- ✅ All TypeScript errors have been fixed
- ✅ Payment integrations handle missing credentials gracefully
- ✅ App works without payment setup

### App Won't Start
- ❌ Check `DATABASE_URL` is set correctly
- ❌ Check `NEXT_PUBLIC_APP_URL` matches your domain
- ❌ Check `AUTH_SECRET` and `SESSION_SECRET` are set

### Database Connection Issues
- ❌ Verify `DATABASE_URL` format is correct
- ❌ Check database server is accessible
- ❌ Ensure database exists and is running

## Success Indicators

✅ Build completes without errors
✅ App loads on your domain
✅ Database connection works
✅ Authentication works (if configured)
✅ Payment features show appropriate messages when not configured

## Need Help?

If you encounter issues:
1. Check Vercel build logs for specific errors
2. Verify all required environment variables are set
3. Test database connection separately
4. Check that your domain matches the configured URLs
