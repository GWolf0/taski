"use client";

import { DOE, MError } from "@/types/common";
import { AuthUser } from "@/types/models";
import React, { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { requestDeleteProfile } from "@/services/requests/profileRequests";
import { useRouter } from "next/navigation";
import { ErrorComp } from "../common/ErrorComp";

function AccountDeleteButton({ authUser }: { authUser: AuthUser }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<MError>();
    const router = useRouter();

    const canSubmit = useMemo(() => !loading, [loading]);

    async function onSubmit() {
        if (!canSubmit) return;

        // small safety confirmation
        if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            return;
        }

        setLoading(true);
        setError(undefined);

        const result: DOE<boolean> = await requestDeleteProfile(authUser!.id, authUser);

        if (result.data) {
            router.push("/?event=account-deleted");
        } else {
            setError({message: result.error?.message ?? "Error deleting the account."});
        }

        setLoading(false);
    }

    return (
        <div className="flex flex-col gap-2">
            {error && <ErrorComp error={error} />}

            <Button
                variant="destructive"
                disabled={!canSubmit}
                onClick={onSubmit}
            >
                {loading ? (
                    <i className="bi bi-arrow-repeat animate-spin" />
                ) : (
                    <i className="bi bi-x-lg" />
                )}
                Delete Account
            </Button>
        </div>
    );
}

export default AccountDeleteButton;
