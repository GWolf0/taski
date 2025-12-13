"use client";

import React, { useMemo, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { MError } from "@/types/common";
import { ErrorComp } from "../common/ErrorComp";
import { requestCreateProject } from "@/services/requests/taskRequests";
import { AuthUser, ProjectModel } from "@/types/models";
import { projectSchema, zodGetFirstErrorMessage } from "@/helpers/validators";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { TaskService } from "@/services/systems/taskService";

function NewProjectForm({ authUser, onDone }: {
    authUser: AuthUser, onDone: () => any,
}) {
    if (!authUser) return null;

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
        const title = fd.get("title")?.toString().trim() ?? "";

        // 1. Validate user input
        const parsed = projectSchema.pick({ title: true }).safeParse({ title });

        if (!parsed.success) {
            setError({ message: zodGetFirstErrorMessage(parsed.error) });
            setLoading(false);
            return;
        }

        // 2. Create project
        const newProjectData = TaskService.makeNewProjectInstance(authUser!.id, parsed.data.title);
        const newProjectDoe = await requestCreateProject(newProjectData, authUser);

        if (newProjectDoe.data) {
            const newProject: ProjectModel = newProjectDoe.data;

            // notify for done
            onDone();

            // open in new tab OR use router
            window.open(`/tasks/${newProject.id}`, "_blank");

            // reload current
            router.refresh();
        } else {
            setError({ message: newProjectDoe.error?.message ?? "Error creating new project", });
        }

        setLoading(false);
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <ErrorComp error={error} />

            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                    <Label className="text-xs">Title</Label>
                    <Input
                        placeholder="Title"
                        name="title"
                        minLength={3}
                        maxLength={128}
                        disabled={loading}
                        required
                        autoFocus
                    />
                </div>
            </div>

            <div className="flex gap-4 items-center justify-end">
                <Button type="reset" disabled={loading} variant={"secondary"}>
                    Reset
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading && <LoaderCircle className="animate-spin mr-2" />}
                    Create
                </Button>
            </div>
        </form>
    );
}

export default NewProjectForm;
