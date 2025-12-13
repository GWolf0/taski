import { DOE } from '@/types/common'
import { AuthUser } from '@/types/models'
import { NextResponse, NextRequest } from 'next/server'
import { AUTH_REDIRECT, GUEST_REDIRECT } from '@/constants/routes';
// import { requestAuthUser } from './services/requests/authRequests';
import { User } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
    const res = NextResponse.next();

    try {
        const pathname = request.nextUrl.pathname;

        // Skip static & next internal files
        if (
            pathname.startsWith("/_next") ||
            pathname.match(/\.(js|css|svg|png|jpg|jpeg|ico)$/)
        ) {
            return NextResponse.next();
        }

        // const user: User | null = await requestAuthUser();
        const user: User | null = null;
        console.log("Auth user", user);
        const isLoggedIn = !!user;

        // Pages that require auth
        if (
            requireAuthPages.some((p) => pathname.startsWith(p)) &&
            !requireAuthExceptionsPages.some((p) => pathname.startsWith(p))
        ) {
            if (!isLoggedIn) {
                return NextResponse.redirect(new URL(GUEST_REDIRECT, request.url));
            }
        }

        // Pages that require guest
        if (requireGuestPages.some((p) => pathname.startsWith(p))) {
            if (isLoggedIn) {
                return NextResponse.redirect(new URL(AUTH_REDIRECT, request.url));
            }
        }

        return res;
    } catch (err) {
        console.error("[Middleware] Unexpected error:", err);
        return NextResponse.redirect(new URL("/", request.url)); // fail-open
    }
}

export const config = {
    runtime: "edge",
}

// pages that require auth, and others that require guest
const requireAuthPages: string[] = [
    "/tasks", "/dashboard", "/save-temp-project"
];
const requireAuthExceptionsPages: string[] = [
    "/tasks/temp"
];
const requireGuestPages: string[] = [
    "/login", "/forgot-password", "/update-password"
];