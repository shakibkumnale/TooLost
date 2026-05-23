import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from './lib/session';

export async function middleware(request) {
  const session = await getIronSession(request.cookies, sessionOptions);
  
  const { pathname } = request.nextUrl;
  
  const isProtectedRoute = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/releases') || 
    pathname.startsWith('/analytics') || 
    pathname.startsWith('/earnings') || 
    pathname.startsWith('/artists') || 
    pathname.startsWith('/profile');

  if (isProtectedRoute && !session.tokens?.access_token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname === '/' && session.tokens?.access_token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
};
