import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const searchParams = request.nextUrl.searchParams

  // Coming Soon Configuration
  const COMING_SOON_ENABLED = true
  const ADMIN_TOKEN = 'castaway-admin-2025'
  
  // List of paths that should bypass coming soon
  const bypassPaths = [
    '/coming-soon',
    '/api/',
    '/_next/',
    '/favicon.ico',
    '/images/',
    '/fonts/'
  ]

  // Check if path should bypass coming soon
  const shouldBypass = bypassPaths.some(path => pathname.startsWith(path))

  // Check for admin access token in URL
  const hasAdminAccess = searchParams.get('admin') === ADMIN_TOKEN

  // Check for admin cookie
  const hasAdminCookie = request.cookies.get('admin-access')?.value === 'true'

  // If admin token is present, set cookie and allow access
  if (hasAdminAccess && !shouldBypass) {
    const response = NextResponse.next()
    response.cookies.set('admin-access', 'true', {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'strict'
    })
    return response
  }

  // Redirect to coming soon if enabled and no admin access
  if (COMING_SOON_ENABLED && !shouldBypass && !hasAdminCookie && !hasAdminAccess) {
    return NextResponse.redirect(new URL('/coming-soon', request.url))
  }

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