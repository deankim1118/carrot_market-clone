import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './lib/session';

interface RoutesBoolean {
  [pathname: string]: boolean;
}

const publicUrls: RoutesBoolean = {
  '/': true,
  '/login': true,
  '/create-account': true,
  '/sms': true,
  '/github/start': true,
  '/github/complete': true,
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const isExist = publicUrls[request.nextUrl.pathname];

  if (!session.id) {
    if (!isExist) {
      // Redirect to the login page if the user is not authenticated
      return NextResponse.redirect(new URL('/', request.url));
    }
  } else {
    if (isExist) {
      // Redirect to the home page if the user is authenticated
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
