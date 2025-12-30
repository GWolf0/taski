"use server";

import { DOE, JSONType } from "@/types/common";
import { AuthUser, ProfileModel } from "@/types/models";
import { supabaseAdmin, supabaseClient } from "@/helpers/supabase";
import { convertToProfileModel } from "@/helpers/converters";
import { redirect } from "next/navigation";
import { Provider, Session, User } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/* --------------------------------------------------------
   AUTH USER
---------------------------------------------------------*/
export async function requestAuthUser(): Promise<User | null> {
    const cooks = await cookies();
    let accessToken = cooks.get('sb-access-token')?.value;
    let refreshToken = cooks.get('sb-refresh-token')?.value;

    if (!accessToken && refreshToken) {
        const { data: { session }, error } = await supabaseClient.auth.refreshSession({ refresh_token: refreshToken });
        if (!session) return null;
        await setupSessionCookies(session);
        accessToken = session.access_token;
        refreshToken = session.refresh_token;
    }

    if (!accessToken) return null;

    supabaseClient.auth.setSession({ access_token: accessToken, refresh_token: refreshToken ?? '' });
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user;
}

export async function requestAuthUserProfile(): Promise<AuthUser> {
    const user = await requestAuthUser();

    if (!user) return null;

    // Load profile row
    const { data: profile, error: profileError } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (profileError || !profile) return null;

    return convertToProfileModel(profile);
}

export async function requestResetPassword(email: string) {
    const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/auth/update-password`;
    return supabaseClient.auth.resetPasswordForEmail(email, { redirectTo });
}

/* --------------------------------------------------------
   PROFILE SYNC (used in callback + email/password flows)
---------------------------------------------------------*/
export async function syncProfile(authUser: User): Promise<ProfileModel | null> {
    const existing = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

    // If profile does not exist → create it
    if (!existing.data) {
        const { data: created, error } = await supabaseAdmin
            .from("profiles")
            .insert({
                id: authUser.id,
                name: authUser.user_metadata.name ?? authUser.user_metadata.full_name ?? authUser.email?.split("@")[0] ?? "New User",
                email: authUser.email,
                providers: [authUser.app_metadata.provider],
                auth_provider: authUser.app_metadata.provider,
                plan: "free",
                meta: { avatar_url: authUser.user_metadata.avatar_url },
                last_auth: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();
        if (error) throw error;
        return convertToProfileModel(created);
    }

    // Otherwise update last_auth
    const currentProviders = existing.data.providers ?? [];
    const provider = authUser.app_metadata.provider;

    const nextProviders = currentProviders.includes(provider)
        ? currentProviders
        : [...currentProviders, provider]; // setup the new providers array (make sure no duplicates)

    const { data: updated, error } = await supabaseAdmin
        .from("profiles")
        .update({
            last_auth: new Date().toISOString(),
            auth_provider: provider,
            providers: nextProviders,
            updated_at: new Date().toISOString(),
        })
        .eq("id", authUser.id)
        .select()
        .single();

    if (error) throw error;
    return convertToProfileModel(updated);
}

export async function setupSessionCookies(session: Session) {
    const cooks = await cookies();
    cooks.set("sb-access-token", session.access_token,
        {
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            maxAge: session.expires_in,
            secure: process.env.NODE_ENV === 'production',
        }
    );
    cooks.set("sb-refresh-token", session.refresh_token,
        {
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            secure: process.env.NODE_ENV === 'production',
        }
    );
}

export async function clearSessionCookies() {
    const cooks = await cookies();
    cooks.delete("sb-access-token");
    cooks.delete("sb-refresh-token");
}

/* --------------------------------------------------------
   EMAIL + PASSWORD SIGN-UP
---------------------------------------------------------*/
export async function requestSignUpWithPassword(
    jsonData: JSONType
): Promise<DOE<ProfileModel>> {
    try {
        const { name, email, password } = jsonData;

        const { data, error } = await supabaseClient.auth.signUp({
            email: email as string,
            password: password as string,
            options: {
                data: { name: name ?? "New User" },
            },
        });

        if (error) return { data: null, error };

        // Email confirmation may be required
        const authUser = data.user;
        if (!authUser) return { data: null, error: { message: "Check your email to confirm your account" } };

        const profile = await syncProfile(authUser);

        if (data.session) await setupSessionCookies(data.session);

        return { data: profile, error: null };
    } catch (e: any) {
        return { data: null, error: { message: e.message } };
    }
}

/* --------------------------------------------------------
   EMAIL + PASSWORD SIGN-IN
---------------------------------------------------------*/
export async function requestSignInWithPassword(jsonData: JSONType): Promise<DOE<ProfileModel>> {
    try {
        const { email, password } = jsonData;

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email as string,
            password: password as string,
        });

        if (error || !data.user) return { data: null, error: { message: "Invalid credentials" } };

        const profile = await syncProfile(data.user);

        if (data.session) await setupSessionCookies(data.session);

        return { data: profile, error: null };
    } catch (e: any) {
        return { data: null, error: { message: e.message } };
    }
}

/* --------------------------------------------------------
   OAUTH SIGN-IN
---------------------------------------------------------*/
export async function requestSignInWithOAuth(provider: Provider, options?: { queryParams?: string }) {
    let redirectUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`;
    if (options?.queryParams) redirectUrl = `${redirectUrl}?${options.queryParams}`;

    const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: redirectUrl,
        },
    });

    if (error) return redirect("/login?error=oauth_failed");

    return redirect(data.url);
}

/* --------------------------------------------------------
   SIGN OUT
---------------------------------------------------------*/
export async function requestSignOut() {
    await supabaseClient.auth.signOut();
    await clearSessionCookies();
}
