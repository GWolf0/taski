"use client"

import React, { useMemo } from 'react'
import Logo from './Logo'
import EditableLabel from '../common/EditableLabel'
import { useTasksStore } from '@/store/useTasksStore'
import { partialProjectSchema, projectSchema } from '@/helpers/validators';
import { Button } from '../ui/button';
import { DOE } from '@/types/common'
import { ProjectModel } from '@/types/models'
import SaveService from '@/services/systems/saveService'

// header for the project/tasks page
function ProjectHeader() {
    const { authUser, project, setProject, setProjectTitle, isSaved, setIsSaved } = useTasksStore();

    const canSave = useMemo(() => !isSaved, [isSaved]);

    // actions fns
    function onNewTitleConfirmed(newTitle: string) {
        const validated = partialProjectSchema.safeParse({title: newTitle});
        if(validated.success) {
            setProjectTitle(newTitle);
            setIsSaved(false);
        }
    }

    async function onSave() {
        if (!canSave) return;
        // saving logic to implemented in "/services/systems/saveService.ts"
        const updateDoe :DOE<ProjectModel> = await SaveService.saveProject(project, authUser);
    }

    return (
        <header className='w-full flex items-center px-2 md:px-4 gap-4' style={{height: "60px"}}>
            {/* // Logo */}
            <Logo />

            {/* // project title label edit */}
            <EditableLabel text={project.title} onConfirmed={onNewTitleConfirmed} />

            {/* // right side actions (save) */}
            <div className='flex gap-0.5 ml-auto'>
                <p className='text-xs'>{isSaved ? "saved" : "not saved"}</p>
                <Button size={"icon"} disabled={canSave} onClick={onSave}>
                    <i className='bi bi-save'></i>
                </Button>
            </div>
        </header>
    )

}

export default ProjectHeader