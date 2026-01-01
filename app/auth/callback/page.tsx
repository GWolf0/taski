"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseClient } from "@/helpers/supabaseClient";
import { setupSessionCookies, syncProfile } from "@/services/requests/authRequests";

export default function AuthCallbackPage() {
    const router = useRouter();
    const params = useSearchParams();
    const redirect = params.get("redirect") ?? "/dashboard";

    useEffect(() => {
        supabaseClient.auth.getSession().then(async ({ data, error }) => {
            if (error || !data.session || !data.session.user) {
                router.replace("/auth/error?reason=session_error");
                return;
            }

            // Sync profile
            await syncProfile(data.session.user);

            // setup session cookies
            await setupSessionCookies(data.session);

            router.replace(redirect);
        });
    }, [router, redirect]);

    return (
        <p className="text-center pt-20">
            Signing you in..
        </p>
    );
}

// // app/auth/callback/route.ts
// import { NextResponse } from "next/server";
// import { setupSessionCookies, syncProfile } from "@/services/requests/authRequests";
// import { supabaseClient } from "@/helpers/supabaseClient";

// export async function GET(request: Request) {
//     const requestUrl = new URL(request.url);
//     const code = requestUrl.searchParams.get("code");
//     const redirect = requestUrl.searchParams.get("redirect");

//     if (!code) {
//         return NextResponse.redirect(`${requestUrl.origin}/auth/error?reason=no_code`);
//     }

//     // Exchange auth code for a session
//     const { data, error } = await supabaseClient.auth.exchangeCodeForSession(code);

//     if (error || !data?.user) {
//         console.error("Auth callback error:", error);
//         return NextResponse.redirect(`${requestUrl.origin}/auth/error?reason=session_error`);
//     }

//     // Sync profile with with received user
//     await syncProfile(data.user);

//     // setup session cookies
//     if (data.session) await setupSessionCookies(data.session);

//     // Redirect to dashboard (or your home page)
//     if (redirect) {
//         return NextResponse.redirect(`${requestUrl.origin}${redirect}`);
//     } else {
//         return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
//     }
// }
