"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { supabaseClient } from "@/helpers/supabase";
import { MError } from "@/types/common";
import { ErrorComp } from "@/components/common/ErrorComp";
import { PasswordValidation, zodGetFirstErrorMessage } from "@/helpers/validators";

export default function UpdatePasswordPage() {
    const params = useSearchParams();
    const code = params.get("code");

    const [password, setPassword] = useState("");
    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<MError>(null);

    useEffect(() => {
        if (!code) {
            setError({ message: "Invalid password reset link." });
            setLoading(false);
            return;
        }

        supabaseClient.auth
            .exchangeCodeForSession(code)
            .then(({ error }) => {
                if (error) setError({ message: error.message });
            })
            .finally(() => setLoading(false));
    }, [code]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validated = PasswordValidation.safeParse(password);
        if (!validated.data) {
            setError({ message: zodGetFirstErrorMessage(validated.error) });
            return;
        }

        const { error } = await supabaseClient.auth.updateUser({ password: validated.data });

        if (error) setError({ message: error.message });
        else setDone(true);
    };

    if (loading) {
        return <div className="text-center pt-20">Validating reset link…</div>;
    }

    if (error) {
        return (
            <ErrorComp error={error} />
        );
    }

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
            <form
                onSubmit={handleSubmit}
                className="space-y-4 max-w-sm mx-auto pt-20"
            >
                <Input
                    type="password"
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    maxLength={20}
                    required
                />

                <Button type="submit" className="w-full">
                    Update password
                </Button>
            </form>
        </MainLayout>
    );
}
