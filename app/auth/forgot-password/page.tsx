"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { requestResetPassword } from "@/services/requests/authRequests";
import { MError } from "@/types/common";
import { ErrorComp } from "@/components/common/ErrorComp";
import { EmailValidation, zodGetFirstErrorMessage } from "@/helpers/validators";
import NotificationComp from "@/components/common/NotificationComp";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [sending, setSending] = useState<boolean>(false);
    const [error, setError] = useState<MError>();
    const [wasSent, setWasSent] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        if (wasSent) return;
        e.preventDefault();
        setError(undefined);

        const validated = EmailValidation.safeParse(email);
        if (!validated.success) {
            setError({ message: zodGetFirstErrorMessage(validated.error) });
            return;
        }

        setSending(true);
        const { data, error } = await requestResetPassword(validated.data);
        if (error) {
            setError(error);
        } else {
            setWasSent(true);
        }
        setSending(false);

        alert("If your email exists, a reset link has been sent.");
    };

    if (wasSent) {
        return (
            <MainLayout authUser={undefined}>
                <section className="space-y-8 p-4 rounded-lg bg-card max-w-xl mx-auto mt-20">
                    <NotificationComp text="Reset link has been sent" type="alert" />
                </section>
            </MainLayout>
        );
    }

    return (
        <MainLayout authUser={undefined}>
            <section className="space-y-8 p-4 rounded-lg bg-card max-w-xl mx-auto mt-20">
                <h1 className="text-lg font-semibold">Forgot Password</h1>

                <ErrorComp error={error} />

                <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">

                    <Input
                        className="text-center"
                        type="email"
                        placeholder="Your email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Button type="submit" className="w-full" disabled={sending || wasSent}>
                        {
                            sending ? "Sending.." : "Send reset link"
                        }
                    </Button>
                </form>
            </section>

        </MainLayout>
    );
}
