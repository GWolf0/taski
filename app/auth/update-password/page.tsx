"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { MError } from "@/types/common";
import { ErrorComp } from "@/components/common/ErrorComp";
import { PasswordValidation, zodGetFirstErrorMessage } from "@/helpers/validators";
import { supabaseClient } from "@/helpers/supabaseClient";
import Link from "next/link";

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState("");
    const [done, setDone] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [initialError, setInitialError] = useState<MError>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<MError>(null);

    useEffect(() => {
        supabaseClient.auth.getSession().then(({ data, error }) => {
            if (error || !data.session) {
                setInitialError({ message: "Invalid or expired password reset link." });
            }
            setInitialLoading(false);
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError(undefined);

        const validated = PasswordValidation.safeParse(password);
        if (!validated.success) {
            setError({ message: zodGetFirstErrorMessage(validated.error) });
            return;
        }

        setLoading(true);
        const { error } = await supabaseClient.auth.updateUser({
            password: validated.data,
        });
        setLoading(false);

        if (error) {
            setError({ message: error.message });
        } else {
            setDone(true);
        }
    };

    if (initialLoading) {
        return <div className="text-center pt-20">Validating reset link…</div>;
    }

    if (initialError) {
        return (
            <MainLayout authUser={undefined}>
                <ErrorComp error={initialError} />
            </MainLayout>
        )
    }

    if (done) {
        return (
            <MainLayout authUser={undefined}>
                <div className="text-center mt-20 space-y-2">
                    <h2 className="text-2xl font-semibold">Password Updated</h2>
                    <p className="text-secondary-foreground">You can now log in with your new password.</p>

                    <Button asChild>
                        <Link href={"/login"} className="mt-4">
                            Login Page
                        </Link>
                    </Button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout authUser={null}>
            <section className="space-y-8 p-4 rounded-lg bg-card max-w-xl mx-auto mt-20">
                <h1 className="text-lg font-semibold">Update Password</h1>

                <ErrorComp error={error} />

                <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
                    <Input
                        className="text-center"
                        type="password"
                        placeholder="New password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={8}
                        maxLength={20}
                        required
                    />

                    <Button type="submit" className="w-full">
                        {loading ? "Updating.." : "Update Password"}
                    </Button>
                </form>
            </section>
        </MainLayout>
    );
}
