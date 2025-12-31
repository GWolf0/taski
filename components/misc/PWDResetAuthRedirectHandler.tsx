"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/helpers/supabaseClient";

// This component makes sure to correctly redirect to "/auth/update-password", 
// if url search params has "type"="recovery" means that the link was forwarded from a password update link
// Include in home page

export default function PWDResetAuthRedirectHandler() {
    const router = useRouter();

    useEffect(() => {
        const location = window.location;
        const type = new URLSearchParams(location.hash.substring(1)).get("type");
        if (type === "recovery") {
            router.replace("/auth/update-password");
        }
    }, []);

    // useEffect(() => {
    //     const location = window.location;
    //     supabaseClient.auth.getSession().then(({ data }) => {
    //         if (data.session) {
    //             const type = new URLSearchParams(location.hash.substring(1)).get("type");

    //             if (type === "recovery") {
    //                 router.replace("/auth/update-password");
    //             }
    //         }
    //     });
    // }, []);

    return null;
}
