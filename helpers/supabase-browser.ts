// supabase-browser.ts
"use client";

import { createClient } from "@supabase/supabase-js";

export const supabaseBrowser = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
        auth: {
            persistSession: true,      // store access/refresh tokens in localStorage
            autoRefreshToken: true,    // auto-refresh when access token expires
            detectSessionInUrl: true,  // detect access token from URL after OAuth
        },
    }
);
