"use client";

import React, { useEffect, useRef, useState } from "react";
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
import Logo from "../layout/Logo";

type LoginPageTabsType = "login" | "register";

function LoginComp() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [tab, setTab] = useState<LoginPageTabsType>("login");

    // get from query params, optional to redirect to a specified route after successful auth
    const redirect = useRef<string | null>(undefined);

    const router = useRouter();

    useEffect(() => {
        // get optional redirect query param, for optional redirect after successful login
        const queryParams = new URLSearchParams(location.search);
        const _redirect: string | null = queryParams.get("redirect");
        redirect.current = _redirect;

        // use hash ("login"|"register")
        const hash = location.hash.substring(1);
        if (["login", "register"].includes(hash.toLowerCase())) {
            setTab(hash.toLowerCase() as LoginPageTabsType);
        }
    }, []);

    useEffect(() => {
        location.hash = `#${tab}`;
    }, [tab]);

    async function onLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const jsonData = Object.fromEntries(formData);
        const validatedJsonData = credentialsSchema.safeParse(jsonData);

        if (validatedJsonData.error) {
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

        router.replace(redirect.current ? `${redirect.current}` : "/dashboard");
    }

    async function onRegister(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const jsonData = Object.fromEntries(formData);
        const validatedJsonData = credentialsSchema.safeParse(jsonData);

        if (validatedJsonData.error) {
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

        router.replace(redirect.current ? `${redirect.current}` : "/dashboard");
    }

    async function onOAuth(provider: Provider) {
        setIsLoading(true);
        setError(null);

        try {
            // pass redirect if exists
            await requestSignInWithOAuth(provider, { queryParams: redirect.current ? `redirect=${redirect.current}` : undefined });
            // redirect happens server-side
        } catch (e: any) {
            console.warn(`OAuth warn: ${e.message?.toString()}`);
            // alert(e.message.toString());
            // setError("OAuth failed");
            // setIsLoading(false);
        }
    }

    function renderOAuthButtons(): React.ReactNode {
        return (
            <div className="space-y-3">
                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                    onClick={() => onOAuth("github")}
                >
                    <i className="bi bi-github mr-1"></i>
                    Sign up with GitHub
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                    onClick={() => onOAuth("google")}
                >
                    <i className="bi bi-google mr-1"></i>
                    Sign up with Google
                </Button>
            </div>
        );
    }
    
    return (
        <Card className="w-full max-w-md shadow-lg border" style={{ transform: "translateY(-60px)" }}>
            <div className="mx-auto">
                <Logo size={64} />
            </div>

            <CardHeader>
                <CardTitle className="text-center text-2xl font-semibold">
                    Welcome to {APP_NAME.toUpperCase()}
                </CardTitle>
            </CardHeader>

            <CardContent>
                {error && (
                    <ErrorComp error={{ message: error }} />
                )}

                <Tabs defaultValue="login" value={tab} onValueChange={(val) => setTab(val as LoginPageTabsType)} className="w-full">
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
                                minLength={8}
                                maxLength={20}
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

                        {renderOAuthButtons()}
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

                        {renderOAuthButtons()}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

export default LoginComp;
