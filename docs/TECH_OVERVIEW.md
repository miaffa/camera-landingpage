# LensFlare - Technical Overview

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.3.0** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5.8.3** - Type safety (strict mode)
- **Tailwind CSS 4.1.12** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Motion** - Animation library
- **Next Themes** - Theme management

### Backend
- **Next.js API Routes** - Server-side logic
- **Supabase** - Backend-as-a-Service (Database & Storage)
- **Drizzle ORM 0.38.4** - Type-safe database ORM
- **PostgreSQL** - Primary database with fallback support
- **postgres-js** - Database driver with connection pooling

### Authentication & Authorization
- **NextAuth.js 5.0.0-beta.25** - Authentication framework
- **Drizzle Adapter** - NextAuth database adapter
- **Google OAuth** - Social authentication
- **Magic Link Email** - Passwordless authentication via Resend
- **JWT** - Token-based authentication
- **Iron Session** - Session management
- **Jose** - JWT encryption/decryption

### Payment Processing
- **Stripe** - Primary payment processor with Connect
- **Stripe Connect** - Marketplace payments for gear owners
- **Application Fees** - 5% platform fee on all transactions
- **Webhook Integration** - Real-time payment processing

### Database Schema

#### Core Tables
- **users** - User profiles with Stripe Connect integration
- **gearListings** - Equipment listings with availability, pricing, location
- **bookings** - Rental transactions with status tracking
- **rentalMessages** - Real-time messaging between users
- **posts** - Social media posts with image support
- **reviews** - User ratings and feedback system

#### Key Relationships
- Users can own multiple gear listings
- Bookings connect renters to gear owners
- Messages are linked to specific bookings
- Posts can tag users and gear items

### Additional Services
- **Resend** - Email delivery service for magic links
- **React Email** - Component-based email templates
- **Mapbox GL JS** - Interactive maps for location features
- **OpenStreetMap Nominatim** - Geocoding API for address lookup
- **Supabase Storage** - File upload and image management
- **FilePond** - Advanced file upload component

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
├── app/                        # Next.js App Router
│   ├── (auth)/                # Authentication pages
│   ├── (in-app)/              # Protected application pages
│   │   ├── app/               # Main app pages
│   │   │   ├── page.tsx       # Home/Feed page
│   │   │   ├── marketplace/   # Gear marketplace
│   │   │   ├── create/        # Gear creation & management
│   │   │   ├── bookings/      # Rental bookings & payments
│   │   │   ├── messages/      # Real-time messaging
│   │   │   └── profile/       # User profiles
│   │   └── layout.tsx         # App layout with navigation
│   ├── api/                   # API routes
│   │   ├── gear/              # Gear management endpoints
│   │   ├── bookings/          # Rental booking endpoints
│   │   ├── messages/          # Messaging endpoints
│   │   ├── stripe/            # Payment processing
│   │   └── webhooks/          # Webhook handlers
│   └── (website-layout)/      # Public website pages
├── components/
│   ├── ui/                    # Base UI components (shadcn/ui)
│   ├── auth/                  # Authentication components
│   ├── rental/                # Booking & rental components
│   ├── messages/              # Chat & messaging components
│   ├── feed/                  # Social feed components
│   ├── map/                   # Map & location components
│   ├── stripe/                # Payment & Stripe components
│   ├── create/                # Gear creation components
│   ├── layout/                # Layout & navigation components
│   └── magicui/               # Advanced UI components
├── lib/                       # Utility functions and configurations
│   ├── auth/                  # Authentication utilities
│   ├── stripe/                # Payment processing utilities
│   ├── gear/                  # Gear management utilities
│   ├── bookings/              # Rental booking logic
│   ├── messaging/             # Chat functionality
│   ├── supabase/              # File storage utilities
│   └── utils.ts               # General utilities
├── db/                        # Database layer
│   ├── index.ts               # Database connection
│   └── schema/                # Drizzle ORM schemas
│       ├── user.ts            # User profiles & auth
│       ├── gear.ts            # Gear listings
│       ├── bookings.ts        # Rental bookings & messages
│       └── plans.ts           # Subscription plans
├── contexts/                  # React Context providers
│   └── SidebarContext.tsx     # Sidebar state management
└── emails/                    # Email templates
    └── magic-link.tsx         # Magic link email template
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

## 🎯 Key Features Implemented

### 1. Gear Rental Marketplace
- **Browse & Search**: Advanced filtering by category, price, location, availability
- **Interactive Maps**: Mapbox integration with geocoding for location-based discovery
- **Gear Listings**: High-quality photos, detailed specs, pricing, availability calendar
- **Real-time Availability**: Dynamic availability checking and booking prevention

### 2. Complete Booking System
- **Request-based Workflow**: Renters request → Owner approves → Payment → Rental
- **Status Tracking**: pending → approved → paid → active → returned → completed
- **Owner Dashboard**: Integrated booking management in "My Gear" section
- **Payment Integration**: Stripe Connect for secure marketplace payments

### 3. Real-time Messaging System
- **Booking-specific Conversations**: Messages tied to specific rental transactions
- **Unread Tracking**: Badge indicators and notification system
- **System Messages**: Automated status updates and notifications
- **Mobile-optimized Interface**: Slide-out panel similar to Instagram DMs

### 4. Stripe Connect Integration
- **Marketplace Payments**: Direct transfers to owner's Connect accounts
- **Platform Fees**: 5% application fee on all transactions
- **Onboarding Flow**: Complete payment setup for gear owners
- **Webhook Processing**: Real-time payment event handling

### 5. User Authentication & Onboarding
- **Magic Link Authentication**: Passwordless email-based login via Resend
- **Google OAuth**: Social authentication option
- **Profile Management**: User profiles with gear ownership tracking
- **Payment Setup**: Required Stripe Connect onboarding for gear owners

### 6. File Upload & Management
- **Supabase Storage**: Secure file upload and storage
- **Image Optimization**: Next.js Image component for performance
- **FilePond Integration**: Advanced file upload with drag-and-drop
- **Multiple Image Support**: Gear listings with multiple photos

### 7. Mobile-First Responsive Design
- **Bottom Navigation**: Mobile-optimized navigation
- **Collapsible Sidebar**: Desktop navigation with toggle functionality
- **Touch-friendly Interface**: Optimized for mobile interactions
- **Progressive Web App**: PWA capabilities with service worker

### 8. Advanced UI Components
- **Custom Components**: Built on shadcn/ui with Tailwind CSS
- **Form Validation**: React Hook Form with Zod schema validation
- **Loading States**: Comprehensive loading and error states
- **Toast Notifications**: User feedback with Sonner

### 9. Database Architecture
- **Type-safe Operations**: Drizzle ORM with comprehensive type safety
- **Fallback Support**: Dual database URL support for reliability
- **Real-time Updates**: SWR for data fetching and caching
- **Optimized Queries**: Efficient database operations with proper indexing

### 10. Development Experience
- **TypeScript Strict Mode**: Maximum type safety throughout
- **ESLint Integration**: Code quality enforcement
- **Hot Reload**: Fast development iteration
- **Error Boundaries**: Graceful error handling
- **Comprehensive Logging**: Debug and error tracking

## 🚨 Common Errors & Troubleshooting

### Build Errors

#### 1. JSX Syntax Errors
**Error**: `Unexpected token 'div'. Expected jsx identifier`
**Cause**: Missing closing bracket, parenthesis, or brace before JSX return statement
**Solution**: Check function body for unclosed brackets/parentheses before return statement
**Quick Check**: Look for missing `}` or `)` in functions above the return statement

#### 2. TypeScript Compilation Errors
**Error**: `Property 'X' does not exist on type 'Y'`
**Cause**: Type mismatches or missing type definitions
**Solution**: Check imports, add proper type annotations, or update type definitions
**Quick Check**: Verify all imports are correct and types are properly defined

#### 3. Module Resolution Errors
**Error**: `Module not found: Can't resolve 'X'`
**Cause**: Missing dependencies or incorrect import paths
**Solution**: Install missing packages or fix import paths
**Quick Check**: Verify package.json dependencies and import statements

### Runtime Errors

#### 1. Authentication Issues
**Error**: `Session expired` or `Unauthorized`
**Cause**: Invalid or expired JWT tokens
**Solution**: Clear session storage, re-authenticate, check token expiration
**Quick Check**: Verify auth configuration and session management

#### 2. Database Connection Errors
**Error**: `Connection refused` or `Database unavailable`
**Cause**: Database URL issues or connection pool exhaustion
**Solution**: Check environment variables, restart database, verify connection strings
**Quick Check**: Verify `DATABASE_URL` and `DIRECT_URL` in environment variables

#### 3. Payment Processing Errors
**Error**: `Stripe API error` or `Payment failed`
**Cause**: Invalid API keys, webhook issues, or payment method problems
**Solution**: Verify Stripe keys, check webhook endpoints, validate payment data
**Quick Check**: Test with Stripe test mode, verify webhook signatures

### Common Debugging Patterns

#### 1. Build Failures
```bash
# Check for syntax errors
pnpm build

# Check TypeScript errors
pnpm tsc --noEmit

# Check ESLint issues
pnpm lint
```

#### 2. Runtime Issues
```bash
# Check console errors in browser
# Check network tab for failed requests
# Check application state in React DevTools
```

#### 3. Database Issues
```bash
# Check database connection
pnpm db:studio

# Verify migrations
pnpm db:push

# Check environment variables
echo $DATABASE_URL
```

### Quick Reference Checklist

#### Before Starting Debugging
- [ ] Check browser console for errors
- [ ] Verify all environment variables are set
- [ ] Ensure all dependencies are installed (`pnpm install`)
- [ ] Check if the issue is in development vs production
- [ ] Verify the error is reproducible

#### Common File Locations to Check
- `src/app/api/` - API route errors
- `src/lib/` - Utility function errors
- `src/components/` - Component rendering errors
- `src/db/schema/` - Database schema issues
- `src/auth.ts` - Authentication configuration

#### Environment-Specific Issues
- **Development**: Check hot reload, clear cache
- **Production**: Check build output, verify deployment
- **Database**: Check connection strings, migration status
- **Payments**: Verify API keys, webhook configuration

### Error Prevention Tips

#### 1. Type Safety
- Always use TypeScript strict mode
- Define proper interfaces for all data structures
- Use type guards for runtime type checking
- Avoid `any` types unless absolutely necessary

#### 2. Code Organization
- Keep components small and focused
- Use proper error boundaries
- Implement proper loading states
- Handle edge cases explicitly

#### 3. Database Operations
- Always use transactions for related operations
- Implement proper error handling
- Use prepared statements (Drizzle ORM handles this)
- Validate data before database operations

#### 4. Authentication
- Always check authentication status
- Implement proper session management
- Handle token refresh scenarios
- Use proper error handling for auth failures

### Common Gotchas

#### 1. Next.js Specific
- **App Router**: Use `"use client"` for client components
- **Server Components**: Can't use hooks or browser APIs
- **API Routes**: Must export named functions (GET, POST, etc.)
- **Middleware**: Runs before page rendering

#### 2. React Patterns
- **State Updates**: Use functional updates for state
- **Effect Dependencies**: Include all dependencies in useEffect
- **Key Props**: Use stable keys for list items
- **Refs**: Use useRef for DOM references

#### 3. Database Queries
- **Relations**: Use proper joins for related data
- **Transactions**: Wrap related operations in transactions
- **Indexes**: Ensure proper database indexing
- **Migrations**: Always test migrations before applying

#### 4. Payment Integration
- **Webhooks**: Verify webhook signatures
- **Idempotency**: Handle duplicate webhook events
- **Error Handling**: Implement proper error recovery
- **Testing**: Use Stripe test mode for development

### Debugging Tools

#### 1. Browser DevTools
- **Console**: Check for JavaScript errors
- **Network**: Monitor API requests and responses
- **Application**: Check local storage and session storage
- **React DevTools**: Inspect component state and props

#### 2. Development Tools
- **TypeScript**: Use `tsc --noEmit` for type checking
- **ESLint**: Use `pnpm lint` for code quality
- **Prettier**: Use `pnpm format` for code formatting
- **Database Studio**: Use `pnpm db:studio` for database inspection

#### 3. Logging
- **Console Logs**: Use for debugging (remove in production)
- **Error Boundaries**: Catch and log React errors
- **API Logs**: Check server logs for API errors
- **Database Logs**: Monitor database query performance

### Emergency Fixes

#### 1. Build Won't Start
```bash
# Clear all caches
rm -rf .next node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

#### 2. Database Issues
```bash
# Reset database
pnpm db:push --force
# Or restore from backup
```

#### 3. Authentication Broken
```bash
# Clear all sessions
# Check auth configuration
# Verify environment variables
```

#### 4. Payment Issues
```bash
# Switch to test mode
# Check webhook endpoints
# Verify API keys
```

---

*This tech stack provides a robust foundation for building modern SaaS applications with Next.js, featuring comprehensive authentication, payment processing, and content management capabilities.*
