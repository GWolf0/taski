import { supabaseAdmin, supabaseClient } from "@/helpers/supabase";
import { requestAuthUser, requestAuthUserProfile, requestSignInWithPassword, requestSignOut, requestSignUpWithPassword, syncProfile } from "@/services/requests/authRequests";
import { DOE } from "@/types/common";
import { AuthUser, ProfileModel } from "@/types/models";
import { User } from "@supabase/supabase-js";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { cleanDB, loginAs } from "../helpers/testHelpers";
import { requestDeleteProfile, requestGetProfile, requestUpdateProfile } from "@/services/requests/profileRequests";

describe("auth requests", () => {
    let start: Date;

    beforeAll(async () => {
        start = new Date();
    });

    afterAll(async () => {
        await cleanDB();
    });

    it("can get the auth user's profile", async () => {
        const { data: authUserProfile, error: authUserProfileError } = await loginAs("user_a@email.com", "user_a123!");
        expect(authUserProfile).toBeTruthy();

        if (authUserProfile) {
            const { data: profile, error: profileError } = await requestGetProfile(authUserProfile.id, authUserProfile);
            expect(profileError).toBeNull();
            expect(profile).toBeTruthy();
        }
    });

    it("cannot get other user's profile", async () => {
        // login as user_a to the User instance
        const { data: authUserAProfile, error: authUserAProfileError } = await loginAs("user_a@email.com", "user_a123!");
        expect(authUserAProfile).toBeTruthy();

        // login as user_b
        const { data: authUserBProfile, error: authUserBProfileError } = await loginAs("user_b@email.com", "user_b123!");
        expect(authUserBProfile).toBeTruthy();

        if (authUserBProfile && authUserAProfile) {
            // check that user_b can't get user_a's profile
            const { data: profile, error: profileError } = await requestGetProfile(authUserAProfile.id, authUserBProfile);
            expect(profile).not.toBeTruthy();
        }
    });

    it("allow auth user to update his profile", async () => {
        // login as user_a
        const { data: authUserAProfile, error: authUserAProfileError } = await loginAs("user_a@email.com", "user_a123!");
        expect(authUserAProfile).toBeTruthy();

        if (authUserAProfile) {
            const { data: updatedProfile, error: updateError } = 
                await requestUpdateProfile(authUserAProfile.id, {name: "User A"}, authUserAProfile);
            expect(updateError).toBeNull();
            expect(updatedProfile?.name).toEqual("User A");
        }
    });

    it("doesn't allow auth user to update other's profile", async () => {
        // login as user_a
        const { data: authUserAProfile, error: authUserAProfileError } = await loginAs("user_a@email.com", "user_a123!");
        expect(authUserAProfile).toBeTruthy();

        // login as user_b
        const { data: authUserBProfile, error: authUserBProfileError } = await loginAs("user_b@email.com", "user_b123!");
        expect(authUserBProfile).toBeTruthy();

        if (authUserAProfile && authUserBProfile) {
            const { data: updatedProfile, error: updateError } = 
                await requestUpdateProfile(authUserAProfile.id, {name: "User B"}, authUserBProfile);
            expect(updateError).not.toBeNull();
        }
    });

    it("allow auth user to delete his profile", async () => {
        // login as user_a
        const { data: authUserAProfile, error: authUserAProfileError } = await loginAs("user_a@email.com", "user_a123!");
        expect(authUserAProfile).toBeTruthy();

        if (authUserAProfile) {
            const { data: deletedProfile, error: deleteError } = await requestDeleteProfile(authUserAProfile.id, authUserAProfile);
            expect(deleteError).toBeNull();
        }
    });

    it("doesn't allow auth user to delete other's profile", async () => {
        // login as user_a
        const { data: authUserAProfile, error: authUserAProfileError } = await loginAs("user_a@email.com", "user_a123!");
        expect(authUserAProfile).toBeTruthy();

        // login as user_b
        const { data: authUserBProfile, error: authUserBProfileError } = await loginAs("user_b@email.com", "user_b123!");
        expect(authUserBProfile).toBeTruthy();

        if (authUserAProfile && authUserBProfile) {
            const { data: deletedProfile, error: deleteError } = await requestDeleteProfile(authUserAProfile.id, authUserBProfile);
            expect(deleteError).not.toBeNull();
        }
    });

});
