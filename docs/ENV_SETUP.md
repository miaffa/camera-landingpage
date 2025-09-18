# Environment Variables Setup Guide

## Quick Start 🚀

1. **Copy the template file:**
   ```bash
   cp env.template .env.local
   ```

2. **Fill in your actual values** in `.env.local`

3. **Never commit `.env.local`** to version control (it's already in `.gitignore`)

## Required Variables by Priority 📋

### 🔴 **Critical (Required for basic functionality)**
- `NEXT_PUBLIC_APP_URL` - Your app URL (e.g., `http://localhost:3000`)
- `AUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `SESSION_SECRET` - Generate with: `openssl rand -base64 32`
- `DATABASE_URL` - Your PostgreSQL connection string

### 🟡 **Important (Required for core features)**
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - For Google OAuth
- `NEXTAUTH_URL` - Usually same as `NEXT_PUBLIC_APP_URL`

### 🟢 **Optional (For specific features)**
- **Stripe** - For payment processing
- **PayPal** - Alternative payment option
- **AWS S3** - For file storage
- **LemonSqueezy/DodoPayments** - Alternative payment providers

## Getting API Keys 🔑

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins

### Stripe
1. Sign up at [Stripe](https://stripe.com/)
2. Get your API keys from the dashboard
3. Set up webhooks pointing to your app

### PayPal
1. Create account at [PayPal Developer](https://developer.paypal.com/)
2. Create a new app
3. Get your client ID and secret

### Database
- **Local**: Install PostgreSQL locally
- **Cloud**: Use services like Neon, Supabase, or Railway

## Development vs Production 🏗️

- **Development**: Use test/sandbox API keys
- **Production**: Use live API keys and update URLs accordingly

## Security Notes 🔒

- Never share your `.env.local` file
- Use different keys for development and production
- Rotate secrets regularly
- Use strong, unique secrets for `AUTH_SECRET` and `SESSION_SECRET`
