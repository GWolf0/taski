"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export type JSONType = { [key: string]: any };

export type MError = {
    code?: string;
    message?: string;
    errors?: JSONType;
    errorKey?: string;
} | undefined | null;

interface ErrorMessageProps {
    error?: MError;
    title?: string; // Optional override title
}

export function ErrorComp({ error, title, errorKey }: {
    error?: MError;
    title?: string; // Optional override title
    errorKey?: string
}) {
    if (!error) return null;

    let displayMessage = error.message ?? "";

    // If there are nested errors and a key is specified
    if (error.errors && errorKey) {
        const nested = error.errors[errorKey];
        if (nested) {
            // nested can be a string, array, or object
            if (typeof nested === "string") {
                displayMessage = nested;
            } else if (Array.isArray(nested)) {
                displayMessage = nested.join(", ");
            } else if (typeof nested === "object") {
                displayMessage = JSON.stringify(nested);
            }
        }
    }

    if (!displayMessage) return null;

    return (
        <Alert variant="destructive" className="mt-2">
            <i className="bi bi-exclamation-triangle-fill" />
            <AlertTitle>{title ?? "Error"}</AlertTitle>
            <AlertDescription>{displayMessage}</AlertDescription>
        </Alert>
    );
}
