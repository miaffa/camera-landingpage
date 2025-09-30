# Component Structure

This directory contains all React components organized by purpose and reusability.

## Directory Structure

```
src/components/
├── ui/                    # Basic UI components (shadcn/ui)
├── layout/               # Layout components (header, footer, etc.)
├── sections/             # Generic, reusable section components
├── marketing/            # Marketing/landing page specific components
└── pwa/                  # PWA specific components
```

## Component Guidelines

### `ui/` - Basic UI Components
- **Purpose**: Reusable, basic UI components
- **Examples**: Button, Input, Card, Dialog, etc.
- **Guidelines**: 
  - Should be generic and reusable
  - No business logic
  - Follow shadcn/ui patterns

### `layout/` - Layout Components
- **Purpose**: Layout and navigation components
- **Examples**: Header, Footer, Sidebar, Navigation
- **Guidelines**:
  - Handle layout structure
  - May contain business logic
  - App-wide components

### `sections/` - Generic Section Components
- **Purpose**: Reusable section components that could be used anywhere
- **Examples**: Hero, Footer, Generic testimonials
- **Guidelines**:
  - Should be generic and configurable
  - Minimal business logic
  - Can be used across different pages

### `marketing/` - Marketing Components
- **Purpose**: Marketing/landing page specific components
- **Examples**: CTAs, Pricing, FAQs, Problem statements
- **Guidelines**:
  - Business-specific content
  - Marketing-focused functionality
  - Landing page specific

### `pwa/` - PWA Components
- **Purpose**: Progressive Web App specific components
- **Examples**: Install prompts, Offline pages
- **Guidelines**:
  - PWA functionality only
  - Service worker related
  - App installation features

## Naming Conventions

- Use PascalCase for component names
- Use descriptive names (e.g., `Hero` instead of `Hero2`)
- Avoid numbered suffixes when possible
- Use kebab-case for file names when needed

## Import Guidelines

- Always use absolute imports: `@/components/ui/button`
- Group imports by type (UI, sections, marketing, etc.)
- Use named exports for better tree-shaking

## Adding New Components

1. **Determine the purpose** - Which folder should it go in?
2. **Follow naming conventions** - Use descriptive names
3. **Keep it focused** - One responsibility per component
4. **Make it reusable** - When possible, make components configurable
5. **Add proper TypeScript types** - Define props interfaces
6. **Update this README** - Document any new patterns
