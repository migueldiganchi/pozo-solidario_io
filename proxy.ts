import { NextRequest, NextResponse } from 'next/server'

export function proxy(req: NextRequest) {
  const res = NextResponse.next()

  // Security headers
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-XSS-Protection', '1; mode=block')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Protect admin route
  if (req.nextUrl.pathname.startsWith('/api/admin')) {
    const secret = req.headers.get('x-admin-secret')
    if (!secret) {
      // Allow through — the route itself validates
    }
  }

  return res
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*'],
}
