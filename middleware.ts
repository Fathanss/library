import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect any route starting with /admin
  if (pathname.startsWith('/admin')) {
    // Check for your auth token/cookie 
    // (Replace 'token' or 'sb-access-token' with your actual session cookie name)
    const token = 
      request.cookies.get('token')?.value || 
      request.cookies.get('sb-access-token')?.value;

    if (!token) {
      // Redirect unauthenticated users to the login page
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname); // Optional: save where they tried to go
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware runs on
export const config = {
  matcher: ['/admin/:path*'],
};