import TasksClientPage from '@/components/clientPages/TasksClientPage';
import MainLayout from '@/components/layout/MainLayout';
import { requestAuthUserProfile } from '@/services/requests/authRequests';
import { requestGetProject } from '@/services/requests/taskRequests';
import { MError } from '@/types/common';
import { AuthUser, ProjectModel } from '@/types/models';
import React from 'react'

async function TasksPage({params}: {
    params: Promise<{ id: string }>
}) {
    // get requested project id
    const { id } = await params;

    // retreive auth user
    const authUser: AuthUser = await requestAuthUserProfile();
    // throw error if not auth
    if(!authUser) throw new Error(JSON.stringify({code: "401", message: "Unauthorized operation (unauthenticated"} as MError));
    
    // retrieve requested project
    const { data: project, error: getProjectError } = await requestGetProject(id, authUser);
    // throw error if error
    if(!project || getProjectError) throw new Error(JSON.stringify(getProjectError as MError));


    return (
        <TasksClientPage authUser={authUser} project={project} />
    )
}

export default TasksPage