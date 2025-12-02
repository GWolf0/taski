"use client";

import React, { useMemo, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "../ui/dialog";
import { Button } from "../ui/button";
import { ErrorComp, MError } from "../common/ErrorComp";
import { LoaderCircle } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { requestUpdateProfile } from "@/services/requests/profileRequests";
import { AuthUser, ProfileModel } from "@/types/models";
import { DOE } from "@/types/common";
import { useRouter } from "next/navigation";
import { partialProfileSchema } from "@/helpers/validators";

function ProfileUpdateButton({ authUser }: { authUser: AuthUser }) {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<MError>();

    const router = useRouter();
    const canSubmit = !loading;

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!canSubmit) return;

        setLoading(true);
        setError(undefined);

        const fd = new FormData(e.currentTarget);
        const newProfileData = Object.fromEntries(fd.entries());

        const parsed = partialProfileSchema.safeParse(newProfileData);
        if (!parsed.success) {
            setError({ message: parsed.error.message ?? "Invalid input" });
            setLoading(false);
            return;
        }

        const res: DOE<ProfileModel> = await requestUpdateProfile(authUser!.id, fd, authUser);

        if (res.data) {
            router.push("/profile?event=profile-updated");
        } else {
            setError({ message: res.error?.message ?? "Error updating the profile" });
        }

        setLoading(false);
    }

    return (
        <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" disabled={dialogIsOpen}>
                    <i className="bi bi-pencil-fill" />
                    Update Profile
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-svw">
                <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                    <DialogDescription>Change your profile details.</DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
                    <ErrorComp error={error} />

                    <div>
                        <Label>Name</Label>
                        <Input
                            name="name"
                            minLength={3}
                            maxLength={64}
                            defaultValue={authUser?.name}
                            disabled={!canSubmit}
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="reset" disabled={!canSubmit}>
                            Reset
                        </Button>
                        <Button type="submit" disabled={!canSubmit}>
                            {loading && <LoaderCircle className="animate-spin" />}
                            Update
                        </Button>
                    </div>
                </form>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ProfileUpdateButton;
