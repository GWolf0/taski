"use client"

import { AuthUser } from '@/types/models'
import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import NewProjectForm from './NewProjectForm'

function NewProjectButton({ authUser, disabled }: {
    authUser: AuthUser, disabled: boolean,
}) {
    const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

    return (
        <Dialog defaultOpen={false} open={dialogIsOpen} onOpenChange={(open) => setDialogIsOpen(open)}>
            <DialogTrigger asChild>
                <Button variant="outline" disabled={dialogIsOpen || disabled}>
                    <i className='bi bi-plus-lg'></i>
                    Project
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-svw">
                <DialogHeader>
                    <DialogTitle>New Project</DialogTitle>
                    <DialogDescription>
                        Create new project.
                    </DialogDescription>
                </DialogHeader>

                <div className="w-full">
                    <NewProjectForm authUser={authUser} />
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

}

export default NewProjectButton