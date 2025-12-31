import { createClient, Provider } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) throw new Error("Supabase env vars not setup");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Client-safe (can be used on frontend)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// export const ACTIVE_PROVIDERS: Provider[] = ["github", "google"];
