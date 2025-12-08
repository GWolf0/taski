"use server";

import { DOE, JSONType } from "@/types/common";
import { AuthUser, ProfileModel } from "@/types/models";
import { supabaseAdmin, supabaseClient } from "@/helpers/supabase";
import { convertToProfileModel } from "@/helpers/converters";
import { redirect } from "next/navigation";
import { Provider, User } from "@supabase/supabase-js";
import { cache } from "react";

/* --------------------------------------------------------
   AUTH USER
---------------------------------------------------------*/
// export const requestAuthUser = cache(
//     async (): Promise<User | null> => {
//         const { data: { user }, error } = await supabaseAdmin.auth.getUser();
//         return user;
//     }
// );
export async function requestAuthUser(): Promise<User | null> {
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    return user;
}

export async function requestAuthUserProfile(): Promise<AuthUser> {
    const { data: { user }, error } = await supabaseClient.auth.getUser();

    if (error || !user) return null;

    // Load profile row
    const { data: profile, error: profileError } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (profileError || !profile) return null;

    return convertToProfileModel(profile);
}

export async function requestResetPasswordRequest(email: string) {
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
                name: authUser.user_metadata.name ?? authUser.email?.split("@")[0] ?? "New User",
                email: authUser.email,
                auth_provider: authUser.app_metadata.provider,
                plan: "free",
                meta: {},
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
    const { data: updated, error } = await supabaseAdmin
        .from("profiles")
        .update({ last_auth: new Date().toISOString() })
        .eq("id", authUser.id)
        .select()
        .single();

    if (error) throw error;
    return convertToProfileModel(updated);
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

        return { data: profile, error: null };
    } catch (e: any) {
        return { data: null, error: { message: e.message } };
    }
}

/* --------------------------------------------------------
   OAUTH SIGN-IN
---------------------------------------------------------*/
export async function requestSignInWithOAuth(provider: Provider) {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
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
    redirect("/");
}
