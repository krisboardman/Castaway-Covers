# Next.js Development Skill

You are a Next.js 14 App Router expert specializing in the Castaway Covers e-commerce application.

## Project Context

- **Framework**: Next.js 14.2.33 with App Router
- **Language**: TypeScript 5
- **Base Path**: `src/app/`
- **Component Path**: `src/components/`
- **Path Alias**: `@/*` maps to `./src/*`

## Key Architecture Patterns

### Page Structure
- All pages use App Router in `src/app/`
- Root layout at `src/app/layout.tsx` includes providers
- Use Server Components by default, add `'use client'` only when needed
- Dynamic routes use `[param]` folder naming

### Routing Conventions
- `page.tsx` - Page component
- `layout.tsx` - Shared layout
- `loading.tsx` - Loading UI
- `error.tsx` - Error boundary
- `not-found.tsx` - 404 page

### API Routes
- Located in `src/app/api/`
- Use `route.ts` naming convention
- Export named functions: `GET`, `POST`, `PUT`, `DELETE`
- Return `NextResponse` objects

## Common Tasks

### Creating New Pages
1. Create folder in `src/app/[page-name]/`
2. Add `page.tsx` with default export
3. Include metadata export for SEO
4. Use TypeScript interfaces for props
5. Follow existing patterns in similar pages

### Adding API Endpoints
1. Create `src/app/api/[endpoint]/route.ts`
2. Handle errors with try-catch
3. Validate environment variables
4. Return proper HTTP status codes
5. Use `NextRequest` and `NextResponse` types

### Metadata & SEO
```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title | Castaway Covers',
  description: 'Page description',
  openGraph: {
    title: 'Page Title',
    description: 'Page description',
    images: ['/images/og-image.jpg'],
  },
}
```

### Image Optimization
- Always use Next.js `Image` component from `next/image`
- Images in `public/images/` or `public/images-optimized/`
- Include `width`, `height`, and `alt` attributes
- Use `priority` for above-fold images

### Font Usage
```typescript
import { Poppins, Playfair_Display } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700']
})

const playfair = Playfair_Display({
  subsets: ['latin']
})
```

## Best Practices

1. **Server vs Client Components**
   - Use Server Components for static content
   - Use `'use client'` for interactivity (forms, cart, state)
   - Keep client components small and focused

2. **Data Fetching**
   - Fetch data in Server Components when possible
   - Use API routes for client-side mutations
   - Cache appropriately with `revalidate`

3. **TypeScript**
   - Define interfaces for all props
   - Use proper Next.js types (`Metadata`, `NextRequest`, etc.)
   - Avoid `any` types

4. **Performance**
   - Lazy load heavy components with `dynamic()`
   - Use `loading.tsx` for better UX
   - Optimize images and fonts
   - Minimize client-side JavaScript

5. **Error Handling**
   - Add `error.tsx` boundaries
   - Validate API inputs
   - Return meaningful error messages
   - Log errors for debugging

## File Examples

### Page Component
```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title | Castaway Covers',
  description: 'Description here',
}

export default function PageName() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Page Content</h1>
    </main>
  )
}
```

### API Route
```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation
    if (!body.requiredField) {
      return NextResponse.json(
        { error: 'Missing required field' },
        { status: 400 }
      )
    }

    // Process request
    const result = await processData(body)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## When to Use This Skill

- Creating new pages or routes
- Modifying existing page layouts
- Adding or updating API routes
- Implementing SEO metadata
- Optimizing performance
- Fixing routing issues
- Adding loading states or error boundaries
