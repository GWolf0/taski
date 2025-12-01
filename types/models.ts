import { AccountPlan } from "@/constants/limits";
import { ProjectData } from "./tasks";
import { Provider } from "@supabase/supabase-js";

export interface ProfileModel {
    id: string,
    name: string,
    email: string,
    auth_provider: Provider,
    plan: AccountPlan,
    meta?: any,
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