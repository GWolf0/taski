"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Logo from './Logo'
import EditableLabel from '../common/EditableLabel'
import { useTasksStore } from '@/store/useTasksStore'
import { partialProjectSchema, projectSchema } from '@/helpers/validators';
import { Button } from '../ui/button';
import { DOE } from '@/types/common'
import { ProjectModel } from '@/types/models'
import SaveService from '@/services/systems/saveService'
import { toast } from 'sonner'
import HeaderActions from './HeaderActions'
import useKey from '@/lib/hooks/useKey'

// header for the project/tasks page
function ProjectHeader() {
    const { authUser, project, setProject, setProjectTitle, isSaved, onSaved } = useTasksStore();

    const [isSaving, setIsSaving] = useState<boolean>(false);

    const canSave = useMemo(() => !isSaved && !isSaving, [isSaved, isSaving]);

    // actions fns
    function onNewTitleConfirmed(newTitle: string) {
        const validated = partialProjectSchema.safeParse({ title: newTitle });
        if (validated.success) {
            setProjectTitle(newTitle);
        }
    }

    const onSave = useCallback(async () => {
        if (!canSave) return;

        setIsSaving(true);

        const updateDoe: DOE<ProjectModel> =
            await SaveService.saveProject(project, authUser);

        if (!updateDoe.data) {
            toast(`Error saving project, ${updateDoe.error?.message}`);
        } else {
            setProject(updateDoe.data);
            onSaved();
            toast("Saved");
        }

        setIsSaving(false);
    }, [canSave, project, authUser, setProject, onSaved]);
    // shortcuts
    useKey("s", onSave, [onSave], "ctrl", true); // save shortcut [ctrl+s]

    return (
        <header className='w-full flex items-center px-2 md:px-4 gap-4' style={{ height: "60px" }}>
            {/* // Logo */}
            <Logo size={24} />

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
                <Button size={"icon"} disabled={!canSave} onClick={onSave} title='save [ctrt+s]'>
                    <i className='bi bi-save'></i>
                </Button>
            </div>

            {/* // header actions (login btn or profile dropdown) */}
            <HeaderActions authUser={authUser} />
        </header>
    )

}

export default ProjectHeader