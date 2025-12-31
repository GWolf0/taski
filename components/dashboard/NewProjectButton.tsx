"use client"

import { AuthUser } from '@/types/models'
import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import NewProjectForm from './NewProjectForm'
import { Separator } from '../ui/separator'

function NewProjectButton({ authUser, disabled, large }: {
    authUser: AuthUser, disabled: boolean, large?: boolean,
}) {
    const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

    return (
        <Dialog defaultOpen={false} open={dialogIsOpen} onOpenChange={(open) => setDialogIsOpen(open)}>
            <DialogTrigger asChild>
                <Button variant="outline" disabled={dialogIsOpen || disabled} size={large ? "lg" : "default"}>
                    <i className='bi bi-plus-lg'></i>
                    Project
                </Button>
            </DialogTrigger>

            <DialogContent style={{ width: "min(99vw, 480px)" }}>
                <DialogHeader>
                    <DialogTitle>New Project</DialogTitle>
                    <DialogDescription>
                        Create new project.
                    </DialogDescription>
                </DialogHeader>

                <div className="w-full">
                    <NewProjectForm authUser={authUser} onDone={() => setDialogIsOpen(false)} />
                </div>

                <Separator />

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