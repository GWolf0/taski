import TasksClientPage from '@/components/clientPages/TasksClientPage';
// import { requestAuthUserProfile } from '@/services/requests/authRequests';
// import { requestGetProject } from '@/services/requests/taskRequests';
import { TaskService } from '@/services/systems/taskService';
import { MError } from '@/types/common';
import { AuthUser, ProjectModel } from '@/types/models';
import React from 'react'

async function TasksPage({params}: {
    params: Promise<{ id: string }>
}) {
    // get requested project id
    const { id } = await params;

    const isTempProject: boolean = id === "temp";

    // retreive auth user
    // const authUser: AuthUser = await requestAuthUserProfile();
    const authUser: AuthUser = undefined;
    // throw error if not auth
    if(!authUser && !isTempProject) throw new Error(JSON.stringify({code: "401", message: "Unauthorized operation (unauthenticated"} as MError));
    
    // retrieve requested project (assign a default new project instance)
    let project: ProjectModel = TaskService.makeNewProjectInstance("", "Default Project");
    if(!isTempProject){
        // const { data, error: getProjectError } = await requestGetProject(id, authUser);
        // // throw error if error
        // if(!data || getProjectError) throw new Error(JSON.stringify(getProjectError as MError));
        // project = data;
    }

    return (
        <TasksClientPage authUser={authUser} project={project} isTempProject={isTempProject} />
    )
}

export default TasksPage