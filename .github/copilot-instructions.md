---
applyTo: '**'
---

# Next.js 16 Best Practices for LLMs (2025)

_Last updated: December 2025 - Next.js 16 Edition_

This document summarizes the latest, authoritative best practices for building, structuring, and maintaining Next.js 16 applications. It is intended for use by LLMs and developers to ensure code quality, maintainability, and scalability.

⚠️ **CRITICAL - Next.js 16 Breaking Changes**: `params` and `searchParams` are now **async** and must be awaited in all components and metadata functions.

---

## 1. Project Structure & Organization

- **Use the `app/` directory** (App Router) for all new projects. Prefer it over the legacy `pages/` directory.
- **Top-level folders:**
  - `app/` — Routing, layouts, pages, and route handlers
  - `public/` — Static assets (images, fonts, etc.)
  - `lib/` — Shared utilities, API clients, and logic
  - `components/` — Reusable UI components
  - `contexts/` — React context providers
  - `styles/` — Global and modular stylesheets
  - `hooks/` — Custom React hooks
  - `types/` — TypeScript type definitions
- **Colocation:** Place files (components, styles, tests) near where they are used, but avoid deeply nested structures.
- **Route Groups:** Use parentheses (e.g., `(admin)`) to group routes without affecting the URL path.
- **Private Folders:** Prefix with `_` (e.g., `_internal`) to opt out of routing and signal implementation details.

- **Feature Folders:** For large apps, group by feature (e.g., `app/dashboard/`, `app/auth/`).
- **Use `src/`** (optional): Place all source code in `src/` to separate from config files.

## 2.1. Server and Client Component Integration (App Router)

**Never use `next/dynamic` with `{ ssr: false }` inside a Server Component.** This is not supported and will cause a build/runtime error.

**Correct Approach:**
- If you need to use a Client Component (e.g., a component that uses hooks, browser APIs, or client-only libraries) inside a Server Component, you must:
  1. Move all client-only logic/UI into a dedicated Client Component (with `'use client'` at the top).
  2. Import and use that Client Component directly in the Server Component (no need for `next/dynamic`).
  3. If you need to compose multiple client-only elements (e.g., a navbar with a profile dropdown), create a single Client Component that contains all of them.

**Example:**

```tsx
// Server Component
import DashboardNavbar from '@/components/DashboardNavbar';

export default async function DashboardPage() {
  // ...server logic...
  return (
    <>
      <DashboardNavbar /> {/* This is a Client Component */}
      {/* ...rest of server-rendered page... */}
    </>
  );
}
```

**Why:**
- Server Components cannot use client-only features or dynamic imports with SSR disabled.
- Client Components can be rendered inside Server Components, but not the other way around.

**Summary:**
Always move client-only UI into a Client Component and import it directly in your Server Component. Never use `next/dynamic` with `{ ssr: false }` in a Server Component.

---

## 2.2. Async `params` and `searchParams` (Next.js 16 Breaking Change)

**CRITICAL: In Next.js 16, `params` and `searchParams` are now `Promise` types and must be awaited.**

**Incorrect (will fail):**
```tsx
export default function Page({ params, searchParams }) {
  const id = params.id; // ❌ WRONG - params is a Promise
  return <div>{id}</div>;
}
```

**Correct:**
```tsx
export default async function Page({ params, searchParams }) {
  const { id } = await params; // ✅ CORRECT - await params
  const { sort } = await searchParams;
  return <div>{id}</div>;
}
```

**Applies to:**
- Dynamic page components (`page.tsx`)
- Dynamic layout components (`layout.tsx`)
- `generateMetadata()` functions
- `generateStaticParams()` functions

**Example with generateMetadata:**
```tsx
interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params; // Must await
  const post = await fetchPost(id);
  
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const post = await fetchPost(id);
  
  return <article>{post.content}</article>;
}
```

---

## 2. Component Best Practices (Next.js 16)

- **Component Types:**
  - **Server Components** (default): For data fetching, heavy logic, and non-interactive UI.
  - **Client Components:** Add `'use client'` at the top. Use for interactivity, state, or browser APIs.
  - **Cache Components:** Use `'use cache'` directive for components that benefit from Partial Pre-Rendering (PPR) and instant navigation.
- **When to Create a Component:**
  - If a UI pattern is reused more than once.
  - If a section of a page is complex or self-contained.
  - If it improves readability or testability.
  - Use `'use cache'` for components with expensive computations that can be cached.
- **Naming Conventions:**
  - Use `PascalCase` for component files and exports (e.g., `UserCard.tsx`).
  - Use `camelCase` for hooks (e.g., `useUser.ts`).
  - Use `snake_case` or `kebab-case` for static assets (e.g., `logo_dark.svg`).
  - Name context providers as `XyzProvider` (e.g., `ThemeProvider`).
- **File Naming:**
  - Match the component name to the file name.
  - For single-export files, default export the component.
  - For multiple related components, use an `index.ts` barrel file.
- **Component Location:**
  - Place shared components in `components/`.
  - Place route-specific components inside the relevant route folder.
- **Props:**
  - Use TypeScript interfaces for props.
  - Prefer explicit prop types and default values.
  - Remember: `params` and `searchParams` are now async - always await them in Page and Layout components.
- **Testing:**
  - Co-locate tests with components (e.g., `UserCard.test.tsx`).

## 3. Naming Conventions (General)

- **Folders:** `kebab-case` (e.g., `user-profile/`)
- **Files:** `PascalCase` for components, `camelCase` for utilities/hooks, `kebab-case` for static assets
- **Variables/Functions:** `camelCase`
- **Types/Interfaces:** `PascalCase`
- **Constants:** `UPPER_SNAKE_CASE`

## 4. API Routes (Route Handlers)

- **Prefer API Routes over Edge Functions** unless you need ultra-low latency or geographic distribution.
- **Location:** Place API routes in `app/api/` (e.g., `app/api/users/route.ts`).
- **HTTP Methods:** Export async functions named after HTTP verbs (`GET`, `POST`, etc.).
- **Request/Response:** Use the Web `Request` and `Response` APIs. Use `NextRequest`/`NextResponse` for advanced features.
- **Dynamic Segments:** Use `[param]` for dynamic API routes (e.g., `app/api/users/[id]/route.ts`).
- **Validation:** Always validate and sanitize input. Use libraries like `zod` or `yup`.
- **Error Handling:** Return appropriate HTTP status codes and error messages.
- **Authentication:** Protect sensitive routes using middleware or server-side session checks.

## 5. General Best Practices (Next.js 16)

- **TypeScript:** Use TypeScript for all code. Enable `strict` mode in `tsconfig.json`. Use proper types for async `params` and `searchParams` as `Promise` types.
- **Turbopack & Build:** Turbopack is now the default bundler in Next.js 16. No manual configuration needed in most cases. Provides faster builds and file system caching by default.
- **React Compiler:** Next.js 16 includes React Compiler for automatic memoization and optimization. Write clean code - no need for manual `useMemo`/`useCallback`.
- **Cache Components:** Use `'use cache'` directive for components that benefit from Partial Pre-Rendering (PPR) and instant navigation.
- **Advanced Caching APIs:** Use `updateTag()`, `refresh()`, and `revalidateTag()` for sophisticated cache management with on-demand revalidation.
- **ESLint & Prettier:** Enforce code style and linting. Use the official Next.js ESLint config.
- **Environment Variables:** Store secrets in `.env.local`. Never commit secrets to version control.
- **Testing:** Use Jest, React Testing Library, or Playwright. Write tests for all critical logic and components.
- **Accessibility:** Use semantic HTML and ARIA attributes. Test with screen readers.
- **Performance:**
  - Use built-in Image and Font optimization (`next/image`, `next/font`).
  - Use Suspense and loading states for async data with `loading.tsx` files.
  - Avoid large client bundles; keep most logic in Server Components.
  - Leverage `'use cache'` for instant navigation with Partial Pre-Rendering (PPR).
  - Benefit from Turbopack's file system caching for faster local development.
  - Implement streaming with `<Suspense>` boundaries for progressive rendering.
- **Security:**
  - Sanitize all user input and validate with libraries like `zod`.
  - Use HTTPS in production.
  - Set secure HTTP headers via middleware.
  - Protect sensitive routes using middleware or server-side session checks.
- **React 19.2 Features:** Leverage View Transitions API, `useEffectEvent()`, and `<Activity/>` component when appropriate for enhanced UX.
- **Documentation:**
  - Write clear README and code comments.
  - Document public APIs and components.
  - Include examples of async `params` and `searchParams` usage in dynamic routes.

# Avoid Unnecessary Example Files

Do not create example/demo files (like ModalExample.tsx) in the main codebase unless the user specifically requests a live example, Storybook story, or explicit documentation component. Keep the repository clean and production-focused by default.

# Next.js 16 Specific Requirements

**Breaking Changes & New Features:**
- **MUST await `params` and `searchParams`** in all Page, Layout, `generateMetadata()`, and `generateStaticParams()` functions
- **Use `'use cache'`** for server components that benefit from caching and Partial Pre-Rendering (PPR) for instant navigation
- **Leverage Turbopack** as the default bundler - it's stable, fast, and requires no additional configuration
- **Use React Compiler** for automatic memoization without manual optimization - the compiler handles it
- **Implement Partial Pre-Rendering (PPR)** for hybrid static/dynamic pages: combine `'use cache'` for static parts with dynamic content
- **Use advanced caching APIs** (`updateTag()`, `refresh()`, `revalidateTag()`) for sophisticated incremental static regeneration
- **Reference React 19.2 features** (View Transitions API, `useEffectEvent()`, `<Activity/>` component) for enhanced user experiences

# Always use the latest documentation and guides

- For every Next.js related request, begin by searching for the most current Next.js documentation, guides, and examples
- **For Next.js 16 specifically**, verify all code examples use async `params` and `searchParams` with proper awaiting
- Use the following tools to fetch and search documentation if they are available:
  - `resolve_library_id` to resolve the package/library name in the docs
  - `get_library_docs` for up-to-date documentation

