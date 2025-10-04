# Project Overview

## 📸 LensFlare - Peer-to-Peer Camera Gear Rental Platform

A **peer-to-peer camera gear rental platform** with a **social feed** where creators can rent out their equipment, discover new gear, and showcase their work—like **Airbnb + Depop + Instagram** for photography & video gear.

### **Mission**

Build a **peer-to-peer camera gear rental platform** with a **social feed** where creators can rent out their equipment, discover new gear, and showcase their work—like **Airbnb + Depop + Instagram** for photography & video gear.

## 🎯 Goals

1. **Validate Demand**: Quickly test if photographers/videographers will list gear and rent from peers.
2. **Enable Trust**: Provide insurance, secure payments, and transparent user ratings.
3. **Foster Community**: Let users share projects and inspire gear rentals through a social feed.

## 🛠️ MVP Scope

The first version will be a **mobile-first web app (PWA)** to launch quickly and iterate before investing in native iOS/Android apps.

### Core Features

#### 👤 User Profiles
- **Bio, profile photo, gear owned, ratings/reviews**
- **ID verification and trust badges**
- **Creator portfolio showcase**

#### 📷 Gear Listings
- **High-quality photos, specs, rental price, availability calendar**
- **Gear condition verification**
- **Insurance coverage options**

#### 🔍 Search & Discovery
- **Filters**: camera type, lens type, price, date, location radius
- **Map view of nearby rentals**
- **AI-powered gear recommendations**

#### 💳 Booking & Payments
- **Secure checkout with escrow-like fund holding**
- **Insurance integration (damage/theft coverage)**
- **10% commission split (5% from renter, 5% from owner)**

#### 💬 Messaging System
- **In-app chat for rental coordination**
- **Text + photo attachments**
- **Rental status updates**

#### 📱 Social Feed
- **IG-style feed of projects, gear showcases, and behind-the-scenes content**
- **Likes, comments, gear tagging**
- **Direct rental CTAs from posts**

#### 📱 Mobile-Optimized PWA
- **Add-to-home-screen install**
- **Push notifications**
- **Offline caching**

## 🌟 Phase-2 Features (Post-MVP)

- **AI gear recommendations** ("Based on your shoot history")
- **Gamification** (badges, rental streaks)
- **Workshop/event listings**
- **Optional gear sales marketplace**
- **Native iOS/Android apps** for deeper device integration

## 🎨 Design Direction

- **Theme**: Dark-mode first with **glassmorphism** accents (frosted cards, subtle blur)
- **Primary Color**: Midnight Blue (#182241)
- **Accents**: Electric Azure (#1A73E8), Neon Magenta (#FF3366), Mint (#00D4B5)
- **Fonts**: Inter (UI), Space Grotesk or Neue Haas for headlines
- **Style**: Photography-first—let user images dominate

## 🎯 Target Market & User Segmentation

### Primary User Base
- **Professional photographers/videographers** with expensive gear ($5K+ cameras) wanting ROI on idle equipment
- **Semi-professional/enthusiast creators** who occasionally need gear upgrades for specific projects
- **Hobbyists** who want to try before buying expensive equipment

### Value Propositions
- **Gear Owners**: Monetize idle equipment, passive income, community building
- **Gear Renters**: Access to professional equipment, try before buy, cost-effective solutions
- **Community**: Social engagement, inspiration, networking opportunities

## 🔐 Trust & Insurance Model

### Trust Building
- **ID verification** (Stripe Identity, Persona)
- **Trust badges** and user ratings
- **Community reviews** and verification
- **Timestamped gear photos** pre/post rental

### Insurance & Protection
- **Third-party insurance integration** (Atlaas, ShareGrid partnerships)
- **Escrow-style payments** with fund holding
- **Clear claims process** (72-hour resolution target)
- **Damage/theft coverage** with transparent terms

### Fraud Prevention
- **Gear condition checklists**
- **Community verification system**
- **Timestamped documentation**
- **Clear liability clauses**

## 💰 Revenue Model & Unit Economics

### Primary Revenue Streams
| Revenue Stream | Commission | Notes |
|---|---|---|
| **Rental Commission** | 10% total | 5% from renter, 5% from owner |
| **Insurance Add-ons** | Pass-through | Optional coverage markup |
| **Boosted Listings** | Variable | Paid visibility for gear |
| **Payment Processing** | Pass-through | Stripe/PayPal fees |
| **Future Gear Sales** | TBD | Marketplace commission |

### Competitive Advantage
- **Lower commission** (10% vs 15% industry standard)
- **Community-driven** approach
- **Mobile-first** experience
- **Social integration** for discovery

## 🌍 Geographic Strategy & Local Density

### Louisville Launch Strategy
- **Supply-first approach**: Onboard gear owners through personal networks
- **Local partnerships**: Studios, colleges, camera shops
- **"Louisville Founding Creators"** badge for early adopters
- **Peer rental incentives**: Early users rent from each other

### Cold Start Solutions
- **Subsidize early users** with waived fees and perks
- **Referral loops** with rewards for bringing in users
- **Local events** and meetups to build trust IRL
- **Exclusive access** for verified creators

## 📣 Social Feed Differentiation

### Rental-Driven Engagement
- **Gear tagging**: Every post must include gear used
- **"Shot with this setup"**: Auto-link gear to listing
- **Direct rental CTA**: "Rent this setup" button on posts
- **Creator incentives**: Earn badges or discounts for gear-linked posts

### Instagram Differentiation
- **Monetization**: Creators earn from gear, not just likes
- **Niche audience**: Photography-first, gear-focused
- **Discovery**: Posts tied to gear availability, not just aesthetics
- **Community**: Professional network building

## 🛠️ Technical Foundation

### 🔐 Advanced Authentication
- **NextAuth.js 5.0** - Modern authentication framework
- **Magic Link Authentication** - Passwordless email login via Resend
- **Google OAuth** - Social authentication option
- **Session management** - JWT-based secure sessions
- **Protected routes** - Middleware-based route protection

### 🗄️ Robust Database Layer
- **Supabase integration** - Backend-as-a-Service for database and storage
- **Drizzle ORM 0.38.4** - Type-safe database operations
- **PostgreSQL** - Production-ready relational database with fallback support
- **Real-time subscriptions** - Live data updates via SWR
- **Schema migrations** - Version-controlled database changes

### 💳 Stripe Connect Payment System
- **Stripe Connect** - Marketplace payments for gear owners
- **Application Fees** - 5% platform fee on all transactions
- **Webhook handling** - Real-time payment event processing
- **Owner Onboarding** - Complete payment setup flow
- **Secure Transfers** - Direct payments to owner accounts

### 🎨 Modern UI/UX
- **Next.js 15.3** - Latest React framework with App Router
- **React 19.1** - Cutting-edge UI library
- **Tailwind CSS 4.1** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Shadcn/ui** - Pre-built component library
- **Mobile-first Design** - Bottom navigation with collapsible desktop sidebar
- **PWA Implementation** - Progressive Web App with service worker
- **Interactive Maps** - Mapbox GL JS with geocoding
- **File Upload** - Advanced FilePond integration with Supabase Storage

### 📧 Professional Email System
- **React Email** - Component-based email templates
- **Resend** - Modern email delivery service
- **AWS SES** - Enterprise email backup
- **Magic Link emails** - Authentication flows
- **Welcome sequences** - User onboarding

### 🔧 Developer Experience
- **TypeScript 5.8** - Full type safety
- **ESLint + Prettier** - Code quality enforcement
- **Turbopack** - Lightning-fast development builds
- **Hot reload** - Instant development feedback
- **Comprehensive tooling** - Modern development stack

### 📱 PWA Capabilities
- **Web App Manifest** - App metadata and icons
- **Service Worker** - Offline functionality and caching
- **Install prompts** - Add to home screen
- **Offline support** - Cached resources
- **Background sync** - Offline data synchronization

## 🏗️ Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (in-app)/          # Protected application pages
│   │   ├── dashboard/     # User dashboard
│   │   ├── gear/          # Gear listings & management
│   │   ├── bookings/      # Rental bookings
│   │   ├── messages/      # In-app messaging
│   │   ├── feed/          # Social feed
│   │   └── profile/       # User profiles
│   ├── (website-layout)/  # Public website pages
│   ├── api/               # API routes
│   │   ├── gear/          # Gear management
│   │   ├── bookings/      # Rental processing
│   │   ├── messages/      # Chat functionality
│   │   ├── feed/          # Social feed API
│   │   └── payments/      # Payment processing
│   └── super-admin/       # Admin dashboard
├── components/             # Reusable UI components
│   ├── ui/                # Base UI components (Shadcn)
│   ├── auth/              # Authentication components
│   ├── gear/              # Gear listing components
│   ├── booking/           # Rental booking components
│   ├── messaging/         # Chat components
│   ├── feed/              # Social feed components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   └── website/           # Website-specific components
├── lib/                   # Utility functions and configurations
│   ├── auth/              # Authentication utilities
│   ├── email/             # Email services
│   ├── gear/              # Gear management utilities
│   ├── booking/           # Rental booking logic
│   ├── messaging/         # Chat functionality
│   ├── feed/              # Social feed utilities
│   ├── payments/          # Payment processing
│   ├── s3/                # File storage
│   └── inngest/           # Background jobs
├── db/                    # Database layer
│   └── schema/            # Drizzle ORM schemas
│       ├── users.ts       # User profiles & verification
│       ├── gear.ts        # Gear listings & specs
│       ├── bookings.ts    # Rental bookings
│       ├── messages.ts    # Chat messages
│       ├── feed.ts        # Social feed posts
│       └── reviews.ts     # User reviews & ratings
├── hooks/                 # Custom React hooks
│   ├── useGear.ts         # Gear management
│   ├── useBooking.ts      # Rental booking
│   ├── useMessaging.ts    # Chat functionality
│   ├── useFeed.ts         # Social feed
│   └── usePWA.ts          # PWA functionality
├── emails/                # Email templates
└── content/               # MDX content and policies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended package manager)
- PostgreSQL database (or Supabase account)
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lensflare
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Configure your environment variables
   ```

4. **Set up the database**
   ```bash
   pnpm drizzle-kit push
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Access the application**
   - Website: `http://localhost:3000`
   - App: `http://localhost:3000/app`
   - Admin: `http://localhost:3000/super-admin`

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Payments
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
LEMONSQUEEZY_API_KEY="your-lemonsqueezy-key"
DODO_API_KEY="your-dodo-api-key"

# Email
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@yourdomain.com"

# Storage
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_REGION="us-east-1"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SIGNIN_ENABLED="true"
SUPER_ADMIN_EMAILS="admin@yourdomain.com"
```

## 📚 Documentation

- **[Tech Overview](./TECH_OVERVIEW.md)** - Comprehensive technology stack details
- **[Environment Setup](./ENV_SETUP.md)** - Detailed environment configuration
- **[Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Production deployment guide
- **[Payment Integration Guide](./PAYMENT_INTEGRATION_GUIDE.md)** - Payment setup instructions
- **[PWA Implementation Guide](./PWA_IMPLEMENTATION_GUIDE.md)** - Progressive Web App setup

## 🚀 Implemented Features

### 1. Complete Gear Rental Marketplace
- **Advanced Search & Filtering** - Category, price, location, availability filters
- **Interactive Map Integration** - Mapbox GL JS with geocoding for location discovery
- **Real-time Availability** - Dynamic availability checking and booking prevention
- **High-quality Gear Listings** - Multiple photos, detailed specs, pricing, availability calendar

### 2. End-to-End Booking System
- **Request-based Workflow** - Renters request → Owner approves → Payment → Rental
- **Status Tracking** - Complete lifecycle: pending → approved → paid → active → returned → completed
- **Owner Dashboard Integration** - Booking management directly in "My Gear" section
- **Payment Processing** - Stripe Connect for secure marketplace payments

### 3. Real-time Messaging System
- **Booking-specific Conversations** - Messages tied to specific rental transactions
- **Unread Message Tracking** - Badge indicators and notification system
- **System Messages** - Automated status updates and notifications
- **Mobile-optimized Interface** - Slide-out panel similar to Instagram DMs

### 4. Stripe Connect Integration
- **Marketplace Payments** - Direct transfers to owner's Connect accounts
- **Platform Fee Collection** - 5% application fee on all transactions
- **Owner Onboarding** - Complete payment setup flow for gear owners
- **Webhook Processing** - Real-time payment event handling

### 5. User Authentication & Onboarding
- **Magic Link Authentication** - Passwordless email-based login via Resend
- **Google OAuth** - Social authentication option
- **Profile Management** - User profiles with gear ownership tracking
- **Payment Setup Requirements** - Stripe Connect onboarding required for gear owners

### 6. File Upload & Management
- **Supabase Storage** - Secure file upload and storage
- **Image Optimization** - Next.js Image component for performance
- **FilePond Integration** - Advanced file upload with drag-and-drop
- **Multiple Image Support** - Gear listings with multiple photos

### 7. Mobile-First Responsive Design
- **Bottom Navigation** - Mobile-optimized navigation
- **Collapsible Sidebar** - Desktop navigation with toggle functionality
- **Touch-friendly Interface** - Optimized for mobile interactions
- **Progressive Web App** - PWA capabilities with service worker

## 🎯 Use Cases

### Professional Photographers
- **Monetize idle equipment** - Generate passive income from expensive gear
- **Access specialized equipment** - Rent specific lenses or cameras for projects
- **Build professional network** - Connect with other creators and clients
- **Showcase work** - Use social feed to display portfolio and attract clients

### Semi-Professional Creators
- **Try before buying** - Test expensive equipment before purchasing
- **Project-specific rentals** - Access gear for specific shoots or events
- **Skill development** - Learn with professional equipment
- **Cost-effective solutions** - Avoid large upfront equipment investments

### Hobbyists & Enthusiasts
- **Explore new gear** - Try different camera systems and lenses
- **Learn photography** - Access professional equipment for learning
- **Special occasions** - Rent gear for events, trips, or special projects
- **Community engagement** - Connect with other photography enthusiasts

### Gear Manufacturers & Retailers
- **Market research** - Understand which gear is most popular
- **Customer insights** - Learn about user preferences and usage patterns
- **Marketing opportunities** - Partner with creators for product promotion
- **Inventory management** - Track gear usage and maintenance needs

## 🚫 Addressing Common Pain Points

### From Existing Platforms (ShareGrid, KitSplit, etc.)

#### Trust & Safety Issues
- **❌ Problem**: Voluntary parting/theft risk, weak insurance coverage
- **✅ Solution**: Enhanced ID verification, comprehensive insurance, escrow payments

#### Pricing & Returns
- **❌ Problem**: Low returns for owners, race to the bottom pricing
- **✅ Solution**: Fair 10% commission, value-based pricing tools, owner incentives

#### Damage & Claims
- **❌ Problem**: Slow reimbursement, complex claims process
- **✅ Solution**: 72-hour resolution target, clear documentation, automated processing

#### Customer Service
- **❌ Problem**: Poor dispute resolution, unresponsive support
- **✅ Solution**: Community-driven support, clear policies, automated workflows

#### Market Saturation
- **❌ Problem**: Too much competition, inconsistent demand
- **✅ Solution**: Social feed drives discovery, AI recommendations, local focus

#### User Experience
- **❌ Problem**: Platform glitches, unclear policies
- **✅ Solution**: Modern PWA, transparent communication, user-friendly design

## 🔧 Development Scripts

```bash
# Development
pnpm dev              # Start development server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm script           # Run custom scripts

# Database
pnpm drizzle-kit push    # Push schema changes
pnpm drizzle-kit studio  # Open Drizzle Studio
pnpm drizzle-kit generate # Generate migrations

# Email Development
pnpm email:dev        # Start email development server
```

## 📊 Current Development Status

### ✅ Completed Features
- **Complete Authentication System** - Magic link + Google OAuth
- **Gear Marketplace** - Search, filter, map integration, real-time availability
- **Booking System** - End-to-end rental workflow with status tracking
- **Real-time Messaging** - Booking-specific conversations with unread tracking
- **Stripe Connect Integration** - Marketplace payments with platform fees
- **File Upload System** - Supabase Storage with image optimization
- **Mobile-First UI** - Responsive design with PWA capabilities
- **Database Architecture** - Type-safe operations with Drizzle ORM
- **API Layer** - Comprehensive REST API with proper error handling

### 🔄 In Progress
- **Build Optimization** - Resolving TypeScript and ESLint errors
- **Performance Tuning** - Code splitting and bundle optimization
- **Error Handling** - Comprehensive error boundaries and user feedback

### 📋 Next Steps
- **Social Feed Implementation** - Instagram-style feed for gear showcases
- **Review System** - User ratings and feedback
- **Advanced Search** - AI-powered recommendations
- **Push Notifications** - Real-time updates for mobile users
- **Insurance Integration** - Third-party coverage options

## 🌟 Key Highlights

### Performance
- **Server-side rendering** - Fast initial page loads
- **Static site generation** - Pre-built pages for speed
- **Image optimization** - Next.js Image component
- **Code splitting** - Automatic bundle optimization
- **SWR caching** - Efficient data fetching

### Security
- **JWT encryption** - Secure token handling
- **CSRF protection** - Request validation
- **SQL injection prevention** - ORM-based protection
- **XSS protection** - Content sanitization
- **Environment variable protection** - Secure configuration

### Scalability
- **Serverless architecture** - Vercel deployment
- **Database optimization** - Efficient queries with fallback support
- **Caching strategies** - SWR and Next.js caching
- **File storage** - Supabase Storage integration
- **Real-time updates** - SWR for data synchronization

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   pnpm lint
   pnpm build
   ```
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Submit a pull request**

## 📄 License

This project is licensed under the MIT License - see the [License.md](../License.md) file for details.

## 🆘 Support

- **Documentation** - Check the docs folder for detailed guides
- **Issues** - Report bugs and request features via GitHub Issues
- **Discussions** - Join community discussions for help and ideas

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies.**
