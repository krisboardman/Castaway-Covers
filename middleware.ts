import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Simple test - redirect home page to coming soon
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/coming-soon', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/',
}