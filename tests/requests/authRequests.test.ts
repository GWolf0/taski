import { supabaseAdmin, supabaseClient } from "@/helpers/supabase";
import { requestAuthUser, requestAuthUserProfile, requestSignInWithPassword, requestSignUpWithPassword, syncProfile } from "@/services/requests/authRequests";
import { DOE } from "@/types/common";
import { AuthUser, ProfileModel } from "@/types/models";
import { User } from "@supabase/supabase-js";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { cleanDB, loginAs } from "../helpers/testHelpers";

describe("auth requests", () => {
    let start: Date;

    beforeAll(async () => {
        start = new Date();
    });

    afterAll(async () => {
        await cleanDB();
    });

    it("signs up a user and creates profile", async () => {
        const result = await requestSignUpWithPassword({email: `test_${Date.now()}@example.com`, password: "password123", name: "Alice"});

        expect(result.error).toBeNull();
        expect(result.data).not.toBeNull();
        expect(result.data!.email).toContain("@example.com");

        // ensure profile row exists
        const { data: profile } = await supabaseAdmin.from("profiles").select("*").eq("id", result.data!.id).single();

        expect(profile).toBeTruthy();
    });

    it("signs in a real user", async () => {
        await supabaseClient.auth.signOut();

        // First create the account
        const email = `login_${Date.now()}@example.com`;
        const pass = "password123";

        await supabaseAdmin.auth.admin.createUser({ email, password: pass, email_confirm: true });

        const result = await requestSignInWithPassword({email, password: pass});

        expect(result.error).toBeNull();
        expect(result.data).not.toBeNull();
        expect(result.data?.email).toContain("login");
    });

    it("gets current auth user", async () => {
        await supabaseClient.auth.signOut();

        const email = `me_${Date.now()}@example.com`;
        const pass = "password";

        await supabaseAdmin.auth.admin.createUser({ email, password: pass, email_confirm: true });

        const profileDoe: DOE<ProfileModel> = await requestSignInWithPassword({email, password: pass});
        expect(profileDoe.data).not.toBeNull();

        const user = await requestAuthUser();
        expect(user).toBeTruthy();
        expect(user?.email).toBe(email);
    });

    it("signout correctly", async () => {
        const { data, error } = await loginAs("tempuser@email.com", "password");
        expect(data?.email).toEqual("tempuser@email.com");

        let authUser: User | null = await requestAuthUser();
        expect(authUser).not.toBeNull();

        await supabaseClient.auth.signOut();

        authUser = await requestAuthUser();
        expect(authUser).toBeNull();
    });

});
