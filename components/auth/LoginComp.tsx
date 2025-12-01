"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";

import {
    requestSignInWithOAuth,
    requestSignInWithPassword,
    requestSignUpWithPassword,
} from "@/services/requests/authRequests";
import { Provider } from "@supabase/supabase-js";
import { ErrorComp } from "../common/ErrorComp";
import { APP_NAME } from "@/constants/app";

function LoginComp() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function onLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        const { error } = await requestSignInWithPassword(formData);

        if (error?.message) {
            setError(error.message);
            setIsLoading(false);
            return;
        }

        // success → redirect handled by server action
    }

    async function onRegister(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        const { error } = await requestSignUpWithPassword(formData);

        if (error?.message) {
            setError(error.message);
            setIsLoading(false);
            return;
        }
    }

    async function onOAuth(provider: Provider) {
        setIsLoading(true);
        setError(null);

        try {
            await requestSignInWithOAuth(provider);
            // redirect happens server-side
        } catch (e: any) {
            setError("OAuth failed");
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-md shadow-lg border">
            <CardHeader>
                <CardTitle className="text-center text-2xl font-semibold">
                    Welcome to {APP_NAME.toUpperCase()}
                </CardTitle>
            </CardHeader>

            <CardContent>
                {error && (
                    <ErrorComp error={{message: error}} />
                )}

                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid grid-cols-2 mb-4">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>

                    {/* LOGIN FORM */}
                    <TabsContent value="login">
                        <form onSubmit={onLogin} className="space-y-4">
                            <Input
                                name="email"
                                type="email"
                                placeholder="Email"
                                required
                            />
                            <Input
                                name="password"
                                type="password"
                                placeholder="Password"
                                required
                            />

                            <Button disabled={isLoading} type="submit" className="w-full">
                                {isLoading ? "Logging in..." : "Log In"}
                            </Button>
                        </form>

                        <Separator className="my-6" />

                        <div className="space-y-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                disabled={isLoading}
                                onClick={() => onOAuth("google")}
                            >
                                Continue with Google
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                disabled={isLoading}
                                onClick={() => onOAuth("github")}
                            >
                                Continue with GitHub
                            </Button>
                        </div>
                    </TabsContent>

                    {/* REGISTER FORM */}
                    <TabsContent value="register">
                        <form onSubmit={onRegister} className="space-y-4">
                            <Input name="name" placeholder="Full Name" required />
                            <Input name="email" type="email" placeholder="Email" required />
                            <Input name="password" type="password" placeholder="Password" required />

                            <Button disabled={isLoading} type="submit" className="w-full">
                                {isLoading ? "Creating..." : "Create Account"}
                            </Button>
                        </form>

                        <Separator className="my-6" />

                        <div className="space-y-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                disabled={isLoading}
                                onClick={() => onOAuth("google")}
                            >
                                Sign up with Google
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                disabled={isLoading}
                                onClick={() => onOAuth("github")}
                            >
                                Sign up with GitHub
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

export default LoginComp;
