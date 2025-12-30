import { AccountPlan } from "@/constants/limits";
import { ProjectData } from "./tasks";
import { Provider } from "@supabase/supabase-js";

export type AuthProvider = Partial<Provider> | "email" | "unknown";

export interface ProfileModel {
    id: string,
    name: string,
    email: string,
    providers: AuthProvider[], // list of providers of the same user (email)
    auth_provider: AuthProvider, // last used provider
    plan: AccountPlan,
    meta?: { avatar_url?: string },
    last_auth: Date,
    created_at: Date,
    updated_at: Date,
}

export type AuthUser = ProfileModel | undefined | null;

export interface ProjectModel {
    id: string,
    title: string,
    description?: string,
    data: ProjectData,
    user_id: string,
    created_at: Date,
    updated_at: Date,
}