// middleware.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL('/signin/', req.url));
  }

  return NextResponse.next();
}

export const config = { 
  matcher: [
    "/dashboard",
    "/profile",
    "/settings",
    "/projects/create",
    "/projects/:path*",
  ]
};