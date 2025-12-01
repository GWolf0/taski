// /store/useTasksStore.ts
import { TaskService } from "@/services/systems/taskService";
import { AuthUser, ProjectModel } from "@/types/models";
import { create } from "zustand";

export interface TasksStoreStateDef {
    project: ProjectModel;
    authUser: AuthUser;
    isSaved: boolean;

    setProject: (project: ProjectModel) => void;
    setAuthUser: (authUser: AuthUser) => void;
    setProjectTitle: (newTitle: string) => void;
    setIsSaved: (val: boolean) => void;
}

export const tasksStoreDefaultValue = {
    project: TaskService.makeNewProjectInstance(""),
    authUser: undefined,
    isSaved: true,
};

export const useTasksStore = create<TasksStoreStateDef>((set) => ({
    ...tasksStoreDefaultValue,

    setProject: (project) => set((state) => ({...state, project })),
    setAuthUser: (authUser) => set((state) => ({...state, authUser })),
    setProjectTitle: (newTitle) => set((state) => ({ ...state, project: { ...state.project, title: newTitle } })),
    setIsSaved: (val: boolean) => set((state) => ({ ...state, isSaved: val })),
}));
