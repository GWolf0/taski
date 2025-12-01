import { AuthUser, ProjectModel } from '@/types/models'
import React, { useEffect, useState } from 'react'
import MainLayout from '../layout/MainLayout'
import { useTasksStore } from '@/store/useTasksStore';
import ProjectHeader from '../layout/ProjectHeader';
import TasksColumnsContainer from '../tasks/TasksColumnsContainer';

function TasksClientPage({project, authUser}: {
    project: ProjectModel, authUser: AuthUser,
}) {
    const { setProject } = useTasksStore();
    
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        setProject(project);
        setLoaded(true);
    }, []);


    if(!loaded) return (
        <MainLayout authUser={authUser} innerClasses='flex items-center justify-center'>
            <p className='text-center'>Loading..</p>
        </MainLayout>
    )

    return (
        <MainLayout authUser={authUser} footer={null} header={
            <ProjectHeader />
        }>

            {/* // columns container */}
            <TasksColumnsContainer />

        </MainLayout>
    )

}

export default TasksClientPage