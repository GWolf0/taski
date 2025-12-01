import { createClient, Provider } from '@supabase/supabase-js';

if(!process.env.NEXT_PUBLIC_SUPABASE_URL
    || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    || process.env.SUPABASE_SERVICE_ROLE_KEY
) throw new Error("Supabase env vars not setup");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

// Client-safe (can be used on frontend)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Server/admin client (full access, use only in server-side code)
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export const ACTIVE_PROVIDERS: Provider[] = ["github", "google"];
