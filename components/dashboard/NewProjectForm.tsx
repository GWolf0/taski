"use client"

import React, { useMemo, useState } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { MError } from '@/types/common'
import { ErrorComp } from '../common/ErrorComp'
import { requestCreateProject } from '@/services/requests/taskRequests'
import { AuthUser, ProjectModel } from '@/types/models'
import { partialProjectSchema } from '@/helpers/validators'
import { useRouter } from 'next/router'
import { LoaderCircle } from 'lucide-react'

function NewProjectForm({ authUser }: {
    authUser: AuthUser,
}) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<MError>();

    const canSumbit = useMemo(() => !loading, [loading]);

    // const router = useRouter();

    // on submit
    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!canSumbit) return;
        
        setLoading(true);
        setError(undefined);

        const fd = new FormData(e.currentTarget);
        const newProjectData = Object.fromEntries(fd.entries());
        const parsed = partialProjectSchema.safeParse(newProjectData);

        if (!parsed.success) {
            setError({ message: parsed.error.message ?? "Error validating user input" });
            setLoading(false);
            return;
        }

        const newProjectDoe = await requestCreateProject(fd, authUser);
        if (newProjectDoe.data) {
            const newProject: ProjectModel = newProjectDoe.data;
            // open the new project in a new browser tab
            window.open(`/tasks/${newProject.id}`, "_blank");
        } else {
            setError({ message: newProjectDoe.error?.message ?? "Error creating new project" });
        }

        setLoading(false);
    }

    return (
        <form className='flex flex-col gap-4' onSubmit={onSubmit}>
            {/* // error component */}
            <ErrorComp error={error} />

            {/* // fields */}
            <div className='flex flex-col gap-2'>
                <div className='flex flex-col gap-0.5'>
                    <Label>Title</Label>
                    <Input placeholder='title' name="title" minLength={3} maxLength={128} disabled={!canSumbit} />
                </div>
            </div>

            {/* // actions */}
            <div className='flex gap-4 items-center justify-end'>
                <Button type='reset' disabled={!canSumbit}>Reset</Button>
                <Button type='submit' disabled={!canSumbit}>
                    { !canSumbit && <LoaderCircle className='animate-spin' /> }
                    Create
                </Button>
            </div>
        </form>
    )

}

export default NewProjectForm