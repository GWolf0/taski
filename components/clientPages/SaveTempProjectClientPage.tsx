"use client"

import { ErrorComp } from '@/components/common/ErrorComp';
import { Button } from '@/components/ui/button';
import { requestCreateProject } from '@/services/requests/taskRequests';
import SaveService from '@/services/systems/saveService';
import { MError } from '@/types/common';
import { AuthUser, ProjectModel } from '@/types/models';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import MainLayout from '../layout/MainLayout';

function SaveTempProjectClientPage({ authUser }: {
    authUser: AuthUser,
}) {
    const [loaded, setLoaded] = useState<boolean>(false); // loaded here refer to the completion state of the saving process
    const [savingStatus, setSavingStatus] = useState<string>("Attempting to save temporary project..");
    const [error, setError] = useState<MError>();
    const [savedProject, setSavedProject] = useState<ProjectModel>();

    useEffect(() => {
        attemptSaveTempProject();
    }, []);

    async function attemptSaveTempProject() {
        // if no temp project then return
        if (!SaveService.doesTempProjectExists()) {
            setSavingStatus(`No temporary project found!`)
            setLoaded(true);
            return;
        }

        // get temp project and try saving it
        const tempProject: ProjectModel = SaveService.loadFromLS();
        const createDoe = await requestCreateProject(tempProject, authUser);

        if (createDoe.error) {
            setSavingStatus(`An error occured`);
            setError(createDoe.error);
        } else {
            if (createDoe.data) {
                setSavingStatus(`Project saved successfully`);
                setSavedProject(createDoe.data);
            } else {
                setSavingStatus(`Unexpected error, no error and no data received`);
            }
        }

        setLoaded(true);
    }

    return (
        <MainLayout authUser={authUser}>
            <div className='w-full h-screen bg-background flex flex-col gap-4 mt-20 items-center'>
                <ErrorComp error={error} />

                <p className='text-center'>{savingStatus}</p>

                {loaded &&
                    savedProject ? (
                    <Link href={`/tasks/${savedProject.id}`}>
                        <Button>
                            Open Project
                            <i className='bi bi-arrow-right'></i>
                        </Button>
                    </Link>
                ) : (
                    <Button onClick={() => window.location.reload()}>
                        <i className='bi bi-arrow-clockwise'></i>
                        Retry
                    </Button>
                )
                }
            </div>
        </MainLayout>
    );

}

export default SaveTempProjectClientPage