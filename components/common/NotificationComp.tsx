"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle } from "lucide-react";

function NotificationComp({ text, textAutoFromQueryParams = false, type = "alert", }: {
    text?: string; textAutoFromQueryParams?: boolean; type?: "alert" | "error";
}) {
    const searchParams = useSearchParams();
    const [visible, setVisible] = useState<boolean>(true);
    const [eventText, setEventText] = useState<string | undefined>();

    useEffect(() => {
        function getEventText() {
            if (eventText != undefined) return eventText;
            if (!textAutoFromQueryParams) return undefined;

            const event = searchParams.get("event");
            if (!event) return undefined;

            // Remove 'event' from the URL without reload or history push
            const url = new URL(window.location.href);
            url.searchParams.delete("event");
            window.history.replaceState(null, "", url.toString());

            const map: Record<string, string> = {
                "profile-updated": "Your profile has been updated successfully.",
                "account-deleted": "Your account has been permanently deleted.",
                "project-created": "New project created successfully.",
                "project-deleted": "Project deleted.",
                "error": "Something went wrong.",
            };

            return map[event] ?? event;
        }

        setEventText(text ?? getEventText());
    }, [textAutoFromQueryParams, searchParams, eventText]);

    // Auto-hide after 4 seconds
    useEffect(() => {
        if (!eventText) return;

        const timer = setTimeout(() => setVisible(false), 8000);
        return () => clearTimeout(timer);
    }, [eventText]);

    if (!eventText || !visible) return null;

    return (
        <div className="w-full my-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <Alert
                variant={type === "error" ? "destructive" : "default"}
                className="shadow-md border"
            >
                {type === "error" ? (
                    <AlertTriangle className="h-4 w-4" />
                ) : (
                    <CheckCircle2 className="h-4 w-4" />
                )}

                <AlertTitle>
                    {type === "error" ? "Error" : "Success"}
                </AlertTitle>

                <AlertDescription>{eventText}</AlertDescription>
            </Alert>
        </div>
    );
}

export default NotificationComp;
