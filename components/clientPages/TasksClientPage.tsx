"use client"

import { AuthUser, ProjectModel } from '@/types/models'
import React, { useEffect, useState } from 'react'
import MainLayout from '../layout/MainLayout'
import { useTasksStore } from '@/store/useTasksStore';
import ProjectHeader from '../layout/ProjectHeader';
import TasksColumnsContainer from '../tasks/TasksColumnsContainer';
import SaveService from '@/services/systems/saveService';

function TasksClientPage({project, authUser, isTempProject}: {
    project: ProjectModel, authUser: AuthUser, isTempProject?: boolean,
}) {
    const { setProject, setAuthUser } = useTasksStore();
    
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        setAuthUser(authUser);
        // if istempproject then try to load temp project from local storage
        setProject(!isTempProject ? project : SaveService.loadFromLS());

        setLoaded(true);
    }, []);

    function renderTempProjectNotice(): React.ReactNode {
        return (
            <div className='w-full px-2 py-0.5 bg-amber-400 text-gray-900 text-xs text-center'>
                This is a temporary project, please <a className='underline hover:opacity-70 font-semibold' href={`/login?redirect=/save-temp-project`} target="_blank">login</a> to save this project.
            </div>
        )
    }

    if(!loaded) return (
        <MainLayout authUser={authUser} innerClasses='flex items-center justify-center'>
            <p className='text-center'>Loading..</p>
        </MainLayout>
    )

    return (
        <MainLayout authUser={authUser} innerClasses='pb-10' footer={null} header={<ProjectHeader />}
            beforeMainContent={<>
                { isTempProject && renderTempProjectNotice() }
            </>}
        >

            {/* // columns container */}
            <TasksColumnsContainer />

        </MainLayout>
    )

}

export default TasksClientPage