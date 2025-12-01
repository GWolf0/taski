"use client";

import { useState } from "react";
import { resetPasswordRequest } from "@/services/requests/authRequests";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await resetPasswordRequest(email);
        alert("If your email exists, a reset link has been sent.");
    };

    return (
        <MainLayout authUser={null}>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto pt-20">
                <Input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Button type="submit" className="w-full">
                    Send reset link
                </Button>
            </form>

        </MainLayout>
    );
}
