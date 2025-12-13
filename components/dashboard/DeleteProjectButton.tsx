"use client"

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { AuthUser, ProjectModel } from '@/types/models'
import { DOE, MError } from '@/types/common';
import { requestDeleteProject } from '@/services/requests/taskRequests';
import { toast } from 'sonner';

function DeleteProjectButton({ project, authUser }: {
    project: ProjectModel, authUser: AuthUser,
}) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<MError>();

    async function onDelete() {
        if (loading) return;
        if (!confirm(`Confirm delete?`)) return;

        setLoading(true);
        setError(undefined);

        console.log(`try delete p: ${project.id}`);
        const deleteSuccessDoe: DOE<boolean> = await requestDeleteProject(project.id, authUser);

        if (deleteSuccessDoe.data) {
            window.location.href = `${window.location.origin}/dashboard?event=project-deleted`;
        } else {
            console.error(deleteSuccessDoe.error?.message);
            setError({ message: deleteSuccessDoe.error?.message });
            toast(deleteSuccessDoe.error?.message);
        }

        setLoading(false);
    }

    return (
        <Button variant={"outline"} size="icon-sm" onClick={onDelete} disabled={loading} className='text-destructive'>
            <i className='bi bi-trash'></i>
        </Button>
    )

}

export default DeleteProjectButton