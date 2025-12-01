// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { syncProfile } from "@/services/requests/authRequests";
import { supabase } from "@/helpers/supabase";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (!code) {
        return NextResponse.redirect(`${requestUrl.origin}/auth/error?reason=no_code`);
    }

    // Exchange auth code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data?.user) {
        console.error("Auth callback error:", error);
        return NextResponse.redirect(`${requestUrl.origin}/auth/error?reason=session_error`);
    }

    // Sync profile with your custom table
    await syncProfile(data.user);

    // Redirect to dashboard (or your home page)
    return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}
