import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// WordPress / old-site URL patterns that should 404 immediately.
// NOTE: specific legacy paths that we want to 301 (e.g. /table-chooser2,
// /design-my-cover, /reviews, /category/uncategorized) are handled by
// `next.config.mjs` redirects and run BEFORE this middleware.
const BLOCKED_PATTERNS = [
  '/feed',
  '/author/',
  '/wp-',
  '/comments/',
  '/sample-page',
  '/hello-world',
  '/elementor-hf/',
]

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const isBlocked = BLOCKED_PATTERNS.some(
    (pattern) => pathname.startsWith(pattern) || pathname.includes(pattern)
  )

  if (isBlocked) {
    return new NextResponse(null, { status: 404 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images/|fonts/).*)',
  ],
}
