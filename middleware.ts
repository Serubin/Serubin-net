import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  issuePortfolioViewCookie,
  PORTFOLIO_VIEW_COOKIE,
  verifyPortfolioViewCookie,
} from './lib/portfolioViewCookie';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const raw = request.cookies.get(PORTFOLIO_VIEW_COOKIE)?.value;
  if (!raw || !(await verifyPortfolioViewCookie(raw))) {
    res.cookies.set(PORTFOLIO_VIEW_COOKIE, await issuePortfolioViewCookie(), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === 'production',
    });
  }
  return res;
}

export const config = {
  matcher: [
    '/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
