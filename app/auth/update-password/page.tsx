"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/helpers/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";

export default function UpdatePasswordPage() {
    const params = useSearchParams();
    const code = params.get("code");

    const [password, setPassword] = useState("");
    const [done, setDone] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { error } = await supabase.auth.updateUser({ password });
        if (error) alert(error.message);
        else setDone(true);
    };

    if (done) {
        return (
            <div className="text-center pt-20">
                <h2 className="text-2xl font-semibold">Password Updated</h2>
                <p>You can now log in with your new password.</p>
            </div>
        );
    }

    return (
        <MainLayout authUser={null}>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto pt-20">
                <Input
                    type="password"
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button type="submit" className="w-full">
                    Update password
                </Button>
            </form>
        </MainLayout>
    );
}
