import { supabaseAdmin, supabaseClient } from "@/helpers/supabase";
import { syncProfile } from "@/services/requests/authRequests";
import { DOE } from "@/types/common";
import { ProfileModel } from "@/types/models";
import { User } from "@supabase/supabase-js";

export async function loginAs(email: string, password: string): Promise<DOE<ProfileModel>> {
    try {
        await supabaseClient.auth.signOut();
        let user: User | null = null;
        let profile: ProfileModel | null = null;

        let { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

        if (!data.user) {
            let { data, error } = await supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true });
            if (data.user) {
                user = data.user;
                await supabaseClient.auth.signInWithPassword({ email, password });
            }
        } else {
            user = data.user;
        }

        if (!user) throw new Error("couldn't signIn or create user");

        profile = await syncProfile(user);

        if (profile) {
            return { data: profile, error: null };
        } else {
            throw new Error("couldn't sync profile");
        }
    } catch (e: any) {
        const message = `[loginAs]: ${e.message}`;
        console.error(message);
        return { data: null, error: { message } }
    }
}

export async function cleanDB() {
    // Always logout first
    await supabaseClient.auth.signOut();

    // 1. Fetch all profiles (this gives us user IDs)
    const { data: profiles } = await supabaseAdmin.from("profiles").select("id");

    if (profiles && profiles.length > 0) {
        // 2. Delete all users (via service role)
        for (const p of profiles) {
            await supabaseAdmin.auth.admin.deleteUser(p.id);
        }
    }

    // 3. Clean up all profile rows (in case cascade did not fire)
    await supabaseAdmin.from("profiles").delete();
}