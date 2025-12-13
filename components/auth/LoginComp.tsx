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
import { createClient, Provider } from "@supabase/supabase-js";
import { ErrorComp } from "../common/ErrorComp";
import { APP_NAME } from "@/constants/app";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { credentialsSchema, zodGetFirstErrorMessage } from "@/helpers/validators";
import { supabaseClient } from "@/helpers/supabase";

function LoginComp() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();

    // get optional redirect query param, for optional redirect after successful login
    const queryParams = new URLSearchParams(location.href);
    const redirect: string | null = queryParams.get("redirect");

    async function onLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const jsonData = Object.fromEntries(formData);
        const validatedJsonData = credentialsSchema.safeParse(jsonData);

        if(validatedJsonData.error) {
            setError(zodGetFirstErrorMessage(validatedJsonData.error));
            setIsLoading(false);
            return;
        }

        const { data, error } = await requestSignInWithPassword(validatedJsonData.data);

        if (error) {
            setError(error.message ?? `Error signing in`);
            setIsLoading(false);
            return;
        }

        router.replace(redirect ? `/${redirect}` : "/dashboard");
    }

    async function onRegister(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const jsonData = Object.fromEntries(formData);
        const validatedJsonData = credentialsSchema.safeParse(jsonData);

        if(validatedJsonData.error) {
            setError(zodGetFirstErrorMessage(validatedJsonData.error));
            setIsLoading(false);
            return;
        }

        const { data, error } = await requestSignUpWithPassword(validatedJsonData.data);

        if (error) {
            setError(error.message ?? `Error signing up`);
            setIsLoading(false);
            return;
        }

        router.replace(redirect ? `/${redirect}` : "/dashboard");
    }

    async function onOAuth(provider: Provider) {
        setIsLoading(true);
        setError(null);

        try {
            // pass redirect if exists
            await requestSignInWithOAuth(provider, { queryParams: redirect ? `redirect=${redirect}` : undefined });
            // redirect happens server-side
        } catch (e: any) {
            setError("OAuth failed");
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-md shadow-lg border" style={{transform: "translateY(-60px)"}}>
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

                        <div className="flex items-center justify-center">
                            <Link href={"/auth/forgot-password"} target="_blank">
                                <Button variant={"link"} className="text-xs">I forgot the password</Button>
                            </Link>
                        </div>

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
                            <Input name="name" placeholder="Name" required />
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
