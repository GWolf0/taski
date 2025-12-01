// app/auth/error/page.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const MESSAGES: Record<string, string> = {
    no_code: "The authentication provider did not return a valid code.",
    session_error: "We could not create your session. Please try again.",
};

export default function AuthErrorPage() {
    const params = useSearchParams();
    const reason = params.get("reason") ?? "unknown";

    const message = MESSAGES[reason] ?? "An unexpected authentication error occurred.";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="text-center max-w-md px-4">
                <h1 className="text-3xl font-bold mb-4">Authentication Error</h1>
                <p className="mb-6 opacity-80">{message}</p>

                <Link
                    href="/login"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                    Go Back to Login
                </Link>
            </div>
        </div>
    );
}
