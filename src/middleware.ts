import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // List of WordPress/old site patterns to block
  const blockedPatterns = [
    '/feed',
    '/author/',
    '/wp-',
    '/comments/',
    '/sample-page',
    '/hello-world',
    '/elementor-hf/',
    '/chair-chooser',
    '/table-chooser'
  ]

  // Check if the URL matches any blocked pattern
  const isBlocked = blockedPatterns.some(pattern => 
    pathname.startsWith(pattern) || pathname.includes(pattern)
  )

  // Return 404 for blocked URLs
  if (isBlocked) {
    return new NextResponse(null, { status: 404 })
  }

  // Continue with the request
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