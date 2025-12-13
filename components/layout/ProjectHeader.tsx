"use client"

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Logo from './Logo'
import EditableLabel from '../common/EditableLabel'
import { useTasksStore } from '@/store/useTasksStore'
import { partialProjectSchema, projectSchema } from '@/helpers/validators';
import { Button } from '../ui/button';
import { DOE } from '@/types/common'
import { ProjectModel } from '@/types/models'
import SaveService from '@/services/systems/saveService'
import { toast } from 'sonner'

// header for the project/tasks page
function ProjectHeader() {
    const { authUser, project, setProject, setProjectTitle, isSaved, setIsSaved } = useTasksStore();

    const justSaved = useRef<boolean>(true);

    const [isSaving, setIsSaving] = useState<boolean>(false);

    const canSave = useMemo(() => !isSaved && !isSaving, [isSaved, isSaving]);

    useEffect(() => {
        if (justSaved.current) {
            justSaved.current = false;
        } else {
            setIsSaved(false);
        }
    }, [project, justSaved]);

    // actions fns
    function onNewTitleConfirmed(newTitle: string) {
        const validated = partialProjectSchema.safeParse({ title: newTitle });
        if (validated.success) {
            setProjectTitle(newTitle);
            setIsSaved(false);
        }
    }

    async function onSave() {
        if (!canSave) return;

        setIsSaving(true);

        const updateDoe: DOE<ProjectModel> = await SaveService.saveProject(project, authUser);

        if (!updateDoe.data) {
            toast(`Error saving project, ${updateDoe.error?.message}`);
        } else {
            justSaved.current = true;
            setProject(updateDoe.data);
            setIsSaved(true);
        }

        setIsSaving(false);
    }

    return (
        <header className='w-full flex items-center px-2 md:px-4 gap-4' style={{ height: "60px" }}>
            {/* // Logo */}
            <Logo />

            {/* // project title label edit */}
            <EditableLabel text={project.title} onConfirmed={onNewTitleConfirmed} />

            {/* // right side actions (save) */}
            <div className='flex gap-1 ml-auto items-center'>
                <p className='text-xs'>
                    {
                        isSaving ? "saving.." :
                            isSaved ? "saved" : "not saved"
                    }
                </p>
                <Button size={"icon"} disabled={!canSave} onClick={onSave}>
                    <i className='bi bi-save'></i>
                </Button>
            </div>
        </header>
    )

}

export default ProjectHeader