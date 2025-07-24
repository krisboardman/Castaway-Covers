import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // For now, let's use a simple flag approach
  // In production, this would be controlled by environment variables
  const COMING_SOON_ENABLED = true; // Set this to false to disable coming soon mode
  const PREVIEW_TOKEN = 'castaway2025';
  
  // Allow bypass with secret parameter
  const url = request.nextUrl
  const bypassToken = url.searchParams.get('preview')
  const hasValidBypass = bypassToken === PREVIEW_TOKEN
  
  // Store bypass in cookie if valid
  if (hasValidBypass) {
    const response = NextResponse.next()
    response.cookies.set('preview-mode', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    })
    return response
  }
  
  // Check if user has valid preview cookie
  const hasPreviewCookie = request.cookies.get('preview-mode')?.value === 'true'
  
  if (!COMING_SOON_ENABLED || hasPreviewCookie || hasValidBypass) {
    return NextResponse.next()
  }
  
  // Redirect to coming soon page
  if (request.nextUrl.pathname !== '/coming-soon') {
    return NextResponse.redirect(new URL('/coming-soon', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}