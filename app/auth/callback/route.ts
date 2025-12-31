// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { setupSessionCookies, syncProfile } from "@/services/requests/authRequests";
import { supabaseClient } from "@/helpers/supabaseClient";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const redirect = requestUrl.searchParams.get("redirect");

    if (!code) {
        return NextResponse.redirect(`${requestUrl.origin}/auth/error?reason=no_code`);
    }

    // Exchange auth code for a session
    const { data, error } = await supabaseClient.auth.exchangeCodeForSession(code);

    if (error || !data?.user) {
        console.error("Auth callback error:", error);
        return NextResponse.redirect(`${requestUrl.origin}/auth/error?reason=session_error`);
    }

    // Sync profile with your custom table
    await syncProfile(data.user);

    if (data.session) await setupSessionCookies(data.session);

    // Redirect to dashboard (or your home page)
    if (redirect) {
        return NextResponse.redirect(`${requestUrl.origin}${redirect}`);
    } else {
        return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
    }
}
