"use client";

import { MError } from "@/types/common";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export default function ErrorPage({ error, reset, }: {
    error: Error & { digest?: string }; reset: () => void;
}) {
    let merror: MError;

    // Try to parse MError from the thrown message
    try {
        const parsed = JSON.parse(error.message);
        if (parsed?.message) merror = parsed as MError;
    } catch (_) {
        // message wasn't JSON of type MError
    }

    if(!merror) merror = { message: error.message, code: "400" };

    return (
        <div className="w-full min-h-[60vh] flex items-center justify-center p-6">
            <Card className="max-w-lg w-full shadow-lg animate-in fade-in zoom-in-75 duration-300 border-destructive/40">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Something went wrong
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="rounded-md bg-destructive/10 p-4 border border-destructive/20">
                        <p className="font-medium">{merror.message}</p>
                        {merror.code && (
                            <p className="text-sm text-muted-foreground mt-1">
                                Error Code: <span className="font-semibold">{merror.code}</span>
                            </p>
                        )}
                        {error.digest && (
                            <p className="text-xs text-muted-foreground mt-2">
                                Debug ID: {error.digest}
                            </p>
                        )}
                    </div>

                    <Button
                        variant="default"
                        onClick={() => reset()}
                        className="flex items-center gap-2"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Try again
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
