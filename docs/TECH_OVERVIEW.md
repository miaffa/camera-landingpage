# Tech Overview

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.3.0** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5.8.3** - Type safety
- **Tailwind CSS 4.1.12** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Motion** - Animation library
- **Next Themes** - Theme management

### Backend
- **Next.js API Routes** - Server-side logic
- **Supabase** - Backend-as-a-Service (Database & Auth)
- **Drizzle ORM 0.38.4** - Type-safe database ORM
- **PostgreSQL** - Primary database
- **Neon Database** - Serverless PostgreSQL driver

### Authentication & Authorization
- **NextAuth.js 5.0.0-beta.25** - Authentication framework
- **Drizzle Adapter** - NextAuth database adapter
- **Google OAuth** - Social authentication
- **Magic Link Email** - Passwordless authentication
- **JWT** - Token-based authentication
- **Iron Session** - Session management
- **Jose** - JWT encryption/decryption

### Payment Processing
- **Stripe** - Primary payment processor
- **LemonSqueezy** - Digital product sales
- **DodoPayments** - Alternative payment gateway
- **PayPal** - Payment gateway integration

### Database Schema
- **Users** - User management with multiple payment provider IDs
- **Plans** - Subscription plans with flexible pricing models
- **Contacts** - Contact form submissions
- **Roadmap** - Product roadmap items
- **Coupons** - Discount and promotion system
- **Waitlist** - Early access signups

## 🏗️ Component Architecture

### Design Principles
- **Single Responsibility Principle** - Each component has one clear purpose
- **Composition over Inheritance** - Build complex UIs by combining simple components
- **Separation of Concerns** - Separate data, UI, and business logic
- **Reusability** - Components should be reusable across different contexts
- **Type Safety** - All components use TypeScript interfaces for props

### File Structure
```
src/
├── lib/data/                    # Centralized mock data
│   ├── mock-data.ts            # Profile and general data
│   ├── marketplace-data.ts     # Marketplace-specific data
│   ├── messages-data.ts        # Messages and conversations
│   ├── create-data.ts          # Gear categories and creation data
│   └── feed-data.ts            # Social feed data
├── components/
│   ├── profile/                # Profile page components
│   │   ├── GearTabContent.tsx
│   │   ├── PostsTabContent.tsx
│   │   ├── SavedTabContent.tsx
│   │   ├── ProfileStats.tsx
│   │   ├── VerificationCTA.tsx
│   │   └── ProfileSkeleton.tsx
│   ├── marketplace/            # Marketplace page components
│   │   ├── SearchBar.tsx
│   │   ├── FocusTabs.tsx
│   │   ├── CategoryPills.tsx
│   │   ├── GearResults.tsx
│   │   ├── PeopleResults.tsx
│   │   └── LocationFilter.tsx
│   ├── messages/               # Messages page components
│   │   ├── MessagesHeader.tsx
│   │   ├── ConversationSearch.tsx
│   │   ├── ConversationItem.tsx
│   │   └── ConversationsList.tsx
│   ├── create/                 # Create page components
│   │   ├── CreateHeader.tsx
│   │   ├── GearCategoryCard.tsx
│   │   ├── GearCategoriesGrid.tsx
│   │   ├── CreateCTA.tsx
│   │   └── EmptyState.tsx
│   ├── feed/                   # Home/Feed page components
│   │   ├── FeedHeader.tsx
│   │   ├── StoryItem.tsx
│   │   ├── StoriesSection.tsx
│   │   ├── FeedPost.tsx
│   │   └── FeedPosts.tsx
│   └── ui/                     # Reusable UI components (shadcn/ui)
└── app/(in-app)/app/           # Main page components
    ├── page.tsx                # Home/Feed page (58 lines)
    ├── marketplace/page.tsx     # Marketplace page (87 lines)
    ├── messages/page.tsx        # Messages page (46 lines)
    ├── create/page.tsx          # Create page (44 lines)
    └── profile/page.tsx         # Profile page (116 lines)
```

### Component Patterns

#### 1. Data Separation
- **Mock data** is centralized in `src/lib/data/` files
- **Type definitions** are co-located with components
- **Business logic** is separated from UI components

#### 2. Component Composition
- **Small, focused components** (typically 20-80 lines)
- **Clear prop interfaces** with TypeScript
- **Event handlers** passed down as props
- **Conditional rendering** handled at the component level

#### 3. Page Structure
- **Main page files** are thin orchestrators (40-120 lines)
- **State management** handled at the page level
- **Component composition** used for complex layouts
- **Clear separation** between data fetching and presentation

#### 4. Reusability Patterns
- **Generic components** like `SearchBar`, `EmptyState`
- **Composable components** like `GearCategoryCard`
- **Consistent interfaces** across similar components
- **Shared data structures** for common entities

### Benefits of This Architecture

#### Maintainability
- **Easy to locate** specific functionality
- **Simple to modify** individual components
- **Clear dependencies** between components
- **Reduced coupling** between different features

#### Performance
- **Smaller bundle sizes** per component
- **Better tree-shaking** opportunities
- **Easier code splitting** for lazy loading
- **Optimized re-renders** with focused components

#### Developer Experience
- **Faster development** with smaller files
- **Better IDE performance** with focused components
- **Easier debugging** with clear component boundaries
- **Simplified testing** with isolated components

#### Scalability
- **Easy to add new features** without affecting existing code
- **Consistent patterns** for new developers
- **Reusable components** reduce duplication
- **Clear architecture** supports team collaboration

### Email & Communication
- **React Email** - Email template system
- **Resend** - Email delivery service
- **AWS SES** - Alternative email service
- **Magic Link Email** - Authentication emails
- **Welcome Email** - User onboarding

### File Storage & CDN
- **AWS S3** - File storage
- **AWS SDK** - S3 client integration
- **Presigned URLs** - Secure file uploads

### State Management & Data Fetching
- **SWR** - Data fetching and caching
- **React Context** - Global state management
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Background Jobs & Automation
- **Inngest** - Background job processing
- **Inngest CLI** - Local development
- **Event-driven architecture** - Async processing

### Development Tools
- **pnpm** - Package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Concurrently** - Parallel script execution
- **TSX** - TypeScript execution

### UI Components & Styling
- **Shadcn/ui** - Component library
- **Class Variance Authority** - Component variants
- **Tailwind Merge** - CSS class merging
- **Tailwind Animate** - Animation utilities
- **CMDK** - Command palette
- **Sonner** - Toast notifications
- **Vaul** - Drawer component
- **Embla Carousel** - Carousel component

### Content Management
- **MDX** - Markdown with JSX
- **Next MDX Remote** - MDX rendering
- **Rehype** - HTML processing
- **Remark GFM** - GitHub Flavored Markdown

### SEO & Analytics
- **Next SEO** - SEO optimization
- **Sitemap** - Dynamic sitemap generation
- **Robots.txt** - Search engine directives
- **Open Graph** - Social media previews

### Security
- **Environment Variables** - Configuration management
- **CSRF Protection** - Cross-site request forgery prevention
- **SQL Injection Prevention** - Drizzle ORM protection
- **XSS Protection** - Content Security Policy
- **Secure Authentication** - JWT with encryption

## 🏗️ Architecture Patterns

### App Router Structure
- **File-based routing** - Next.js 13+ App Router
- **Server Components** - Server-side rendering
- **Client Components** - Interactive components
- **Layouts** - Nested layout system
- **Templates** - Page templates
- **Loading & Error** - Built-in error handling

### Database Design
- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** - Relational database
- **Schema migrations** - Version-controlled database changes
- **Relationships** - Foreign key constraints
- **Indexes** - Query optimization

### Authentication Flow
- **Multi-provider auth** - Google OAuth + Magic Link
- **Session management** - JWT-based sessions
- **User impersonation** - Admin functionality
- **Email verification** - Account validation

### Payment Architecture
- **Multi-provider support** - Stripe, LemonSqueezy, DodoPayments, PayPal
- **Subscription management** - Recurring billing
- **One-time payments** - Single purchases
- **Webhook handling** - Payment event processing
- **Plan management** - Flexible pricing models

### State Management
- **SWR** - Server state caching
- **React Context** - Client state
- **Form state** - React Hook Form
- **Theme state** - Next Themes

## 🔧 Configuration Files

- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `drizzle.config.ts` - Database ORM configuration
- `components.json` - Shadcn/ui configuration
- `eslint.config.mjs` - ESLint configuration
- `postcss.config.mjs` - PostCSS configuration

## 📦 Key Dependencies

### Core Framework
- `next` - React framework
- `react` - UI library
- `typescript` - Type safety

### UI & Styling
- `@radix-ui/*` - Component primitives
- `tailwindcss` - CSS framework
- `lucide-react` - Icons
- `motion` - Animations
- `next-themes` - Theme management

### Database & ORM
- `@supabase/supabase-js` - Supabase client
- `drizzle-orm` - Database ORM
- `@neondatabase/serverless` - Database driver
- `@auth/drizzle-adapter` - Auth adapter

### Authentication
- `next-auth` - Authentication framework
- `iron-session` - Session management
- `jose` - JWT handling

### Payments
- `stripe` - Payment processing
- `dodopayments` - Alternative payments
- `resend` - Email service

### Development
- `concurrently` - Parallel scripts
- `tsx` - TypeScript execution
- `prettier` - Code formatting

## 🚀 Performance Optimizations

- **Server-side rendering (SSR)** - Initial page load
- **Static site generation (SSG)** - Pre-built pages
- **Image optimization** - Next.js Image component
- **Code splitting** - Automatic bundle splitting
- **Bundle optimization** - Tree shaking
- **SWR caching** - Data fetching optimization
- **Turbopack** - Fast development builds

## 🔒 Security Features

- **Environment variable protection** - Secure configuration
- **CSRF protection** - Request validation
- **SQL injection prevention** - ORM protection
- **XSS protection** - Content sanitization
- **Secure authentication** - JWT with encryption
- **Session management** - Secure session handling
- **Admin impersonation** - Secure admin features

## 📱 PWA Implementation (Recommended)

### Current Status
❌ **Not yet implemented** - PWA features need to be added

### Required Components
1. **Web App Manifest** - App metadata and icons
2. **Service Worker** - Offline functionality and caching
3. **PWA Icons** - Multiple icon sizes for different devices
4. **Offline Support** - Cached resources for offline use
5. **Install Prompts** - Add to home screen functionality

### Implementation Plan
```typescript
// 1. Create manifest.json in public/
{
  "name": "Indie Kit",
  "short_name": "IndieKit",
  "description": "NextJS starter kit for building your own SaaS",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}

// 2. Add service worker registration
// 3. Implement offline caching strategies
// 4. Add install prompts
// 5. Configure PWA meta tags
```

### PWA Dependencies to Add
- `next-pwa` - PWA plugin for Next.js
- `workbox-webpack-plugin` - Service worker generation
- PWA icon generator tools

## 🌐 Deployment & Infrastructure

### Hosting
- **Vercel** - Primary hosting platform
- **Supabase** - Database and auth hosting
- **AWS S3** - File storage
- **AWS SES** - Email delivery

### Environment Management
- **Development** - Local development with hot reload
- **Production** - Vercel deployment
- **Environment variables** - Secure configuration

### Monitoring & Analytics
- **Vercel Analytics** - Performance monitoring
- **Supabase Dashboard** - Database monitoring
- **Error tracking** - Built-in Next.js error handling

## 🔄 Development Workflow

### Scripts
- `pnpm dev` - Development server with Turbopack
- `pnpm build` - Production build
- `pnpm start` - Production server
- `pnpm lint` - Code linting
- `pnpm script` - Custom script execution

### Development Tools
- **Hot reload** - Fast development iteration
- **Type checking** - Real-time TypeScript validation
- **ESLint** - Code quality enforcement
- **Prettier** - Code formatting
- **Concurrently** - Parallel development servers

## 📊 Database Schema Overview

### Core Tables
- **app_user** - User accounts and authentication
- **account** - OAuth provider accounts
- **session** - User sessions
- **verificationToken** - Email verification
- **authenticator** - WebAuthn credentials
- **plans** - Subscription plans
- **contact** - Contact form submissions
- **roadmap** - Product roadmap
- **waitlist** - Early access signups

### Relationships
- Users → Plans (many-to-one)
- Users → Accounts (one-to-many)
- Users → Sessions (one-to-many)
- Plans → Multiple pricing models

## 🎯 Key Features

### Authentication System
- Multi-provider authentication
- Magic link email authentication
- User impersonation for admins
- Secure session management

### Payment Processing
- Multiple payment providers
- Subscription management
- One-time payments
- Webhook handling

### Content Management
- MDX blog system
- Dynamic sitemap generation
- SEO optimization
- Policy page management

### Admin Dashboard
- Super admin functionality
- User management
- Plan management
- Contact form management
- Waitlist management

### Developer Experience
- Type-safe database operations
- Comprehensive error handling
- Hot reload development
- Automated code formatting
- ESLint integration

---

*This tech stack provides a robust foundation for building modern SaaS applications with Next.js, featuring comprehensive authentication, payment processing, and content management capabilities.*
