import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// Protected routes that require authentication
const protectedRoutes = ["/dashboard", "/profile", "/settings", "/cart"];

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // If the user is not authenticated and trying to access a protected route, redirect to login
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
}

// Apply middleware only to protected routes
export const config = { matcher: ["/dashboard","/dashboard/:path*"] };
