"use server";

import { DOE, JSONType } from "@/types/common";
import { AuthUser, ProfileModel } from "@/types/models";
import { partialProfileSchema } from "@/helpers/validators";
import { supabaseAdmin, supabaseClient } from "@/helpers/supabase";
import { convertToProfileModel } from "@/helpers/converters";
import {
  canDeleteProfile,
  canGetProfile,
  canUpdateProfile,
} from "@/helpers/policies";
import { filterQuery, PaginatedData } from "@/helpers/query";
import { requestSignOut } from "./authRequests";

/* --------------------------------------------------------
  GET PROFILE
---------------------------------------------------------*/
export async function requestGetProfile(userId: string, authUser: AuthUser): Promise<DOE<ProfileModel>> {
  try {
    const { data, error } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) return { data: null, error: { message: error.message } };

    const profile = convertToProfileModel(data);
    if (!profile) return { data: null, error: { message: "Couldn't convert profile model" } };

    if (!canGetProfile(authUser, profile)) {
      return { data: null, error: { message: "Unauthorized operation", code: "403" } };
    }

    return { data: profile, error: null };
  } catch (error: any) {
    console.error("[getProfile] Unexpected error:", error);
    return { data: null, error: { message: error.message } };
  }
}

/* --------------------------------------------------------
   UPDATE PROFILE — also updates supabaseClient auth metadata if needed
---------------------------------------------------------*/
export async function requestUpdateProfile(profileId: string, jsonData: JSONType, authUser: AuthUser): Promise<DOE<ProfileModel>> {
  try {
    if (!canUpdateProfile(authUser, profileId)) {
      return { data: null, error: { message: "Unauthorized", code: "403" } };
    }

    const updates = jsonData;
    const parsed = partialProfileSchema.pick({name: true}).safeParse(updates);

    if (!parsed.success) {
      return {
        data: null,
        error: {
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        },
      };
    }

    const updateData = parsed.data;

    /* --- Update profile table --- */
    const { data, error } = await supabaseClient
      .from("profiles")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profileId)
      .select()
      .single();

    if (error) return { data: null, error: { message: error.message } };

    const profile = convertToProfileModel(data);
    if (!profile) return { data: null, error: { message: "Couldn't convert profile model" } };

    /* --- Reflect update on supabaseClient Auth (public.auth.users metadata) --- */
    // Only update auth metadata fields you care about
    await supabaseClient.auth.updateUser({
      data: {
        name: profile.name,
        // plan: profile.plan,
      },
    });

    return { data: profile, error: null };
  } catch (error: any) {
    console.error("[updateUser] Unexpected error:", error);
    return { data: null, error: { message: error.message } };
  }
}

/* --------------------------------------------------------
   DELETE PROFILE — also deletes supabaseClient auth user
---------------------------------------------------------*/
export async function requestDeleteProfile(profileId: string, authUser: AuthUser): Promise<DOE<boolean>> {
  try {
    if (!canDeleteProfile(authUser, profileId)) {
      return { data: null, error: { message: "Unauthorized", code: "403" } };
    }

    /* 1. Delete profile row */
    const { error: profileError } = await supabaseClient
      .from("profiles")
      .delete()
      .eq("id", profileId);

    if (profileError) return { data: null, error: { message: profileError.message } };

    /* 2. Delete auth user (needs service-key client) */
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(profileId);

    if (deleteError) return { data: null, error: { message: deleteError.message } };

    /* 3. Delete projects made by the user */
    await supabaseClient.from("projects").delete().eq("user_id", profileId);

    /* 4. Sign out current session if deleting self */
    if (authUser?.id === profileId) {
      await requestSignOut();
      // await supabaseClient.auth.signOut();
    }

    return { data: true, error: null };
  } catch (error: any) {
    console.error("[deleteUser] Unexpected error:", error);
    return { data: null, error: { message: error.message } };
  }
}

// request filtered
export async function requestFilteredProfiles(queryParams: URLSearchParams, authUser: AuthUser, defaultSelect: string = "*"): 
Promise<DOE<PaginatedData<ProfileModel>>> {
  try {
    const filteredData = await filterQuery(supabaseClient.from("profiles"), queryParams, defaultSelect);
    const profiles: ProfileModel[] = filteredData.data.map(entry => convertToProfileModel(entry)).
                                    filter(entry => !!entry).filter(entry => canGetProfile(authUser, entry));
    return {
      data: { ...filteredData, data: profiles },
      error: null
    };
  } catch (error: any) {
    console.error("[requestFilteredProfiles] Unexpected error:", error);
    return { data: null, error: { message: error.message } };
  }
}