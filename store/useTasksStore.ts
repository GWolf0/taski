// /store/useTasksStore.ts
import { TaskService } from "@/services/systems/taskService";
import { AuthUser, ProjectModel } from "@/types/models";
import { TaskItem, TasksColumnType } from "@/types/tasks";
import { create } from "zustand";

export interface TasksStoreStateDef {
    project: ProjectModel;
    authUser: AuthUser;
    isSaved: boolean;
    selectedTask: { id: string; column: TasksColumnType } | undefined, // for edit

    setProject: (project: ProjectModel, setDirty?: boolean) => void;
    setAuthUser: (authUser: AuthUser) => void;
    setProjectTitle: (newTitle: string) => void;
    // setIsSaved: (value: boolean) => void;
    onSaved: () => void;

    triggerTaskItemEdit: (value: { id: string, column: TasksColumnType } | undefined) => void;
    editSelectedTaskItem: (text: string) => void;
    deleteTaskItem: (taskId: string) => void;
    moveTaskItem: (taskId: string, fromCol: TasksColumnType, toCol: TasksColumnType) => void;
}

export const tasksStoreDefaultValue = {
    project: TaskService.makeNewProjectInstance(""),
    authUser: undefined,
    isSaved: true,
    selectedTask: undefined,
};

export const useTasksStore = create<TasksStoreStateDef>((set) => ({
    ...tasksStoreDefaultValue,

    setProject: (project, setDirty?: boolean) => set((state) => ({ ...state, project, isSaved: Boolean(!setDirty) })),
    setAuthUser: (authUser) => set((state) => ({ ...state, authUser })),
    setProjectTitle: (newTitle) => set((state) => ({ ...state, project: { ...state.project, title: newTitle }, isSaved: false })),
    // setIsSaved: (value: boolean) => set((state) => ({ ...state, isSaved: value })),
    onSaved: () => set((state) => ({ ...state, isSaved: true })),

    triggerTaskItemEdit: (value: { id: string, column: TasksColumnType } | undefined) => set((state) => {
        return { ...state, selectedTask: value };
    }),
    editSelectedTaskItem: (text: string) => set((state) => {
        return {
            ...state, project: {
                ...state.project, data: {
                    ...state.project.data,
                    columns: Object.fromEntries(
                        Object.entries(state.project.data.columns).map(([col, tasks]) => {
                            return [col, tasks.map(task => task.id === state.selectedTask?.id ? { ...task, text } : task)];
                        })
                    ) as Record<TasksColumnType, TaskItem[]>
                }
            }, selectedTask: undefined, isSaved: false,
        }
    }),
    deleteTaskItem: (taskId: string) => set((state) => {
        return {
            ...state, project: {
                ...state.project, data: {
                    ...state.project.data,
                    columns: Object.fromEntries(
                        Object.entries(state.project.data.columns).map(([col, tasks]) => {
                            return [col, tasks.filter(task => task.id !== taskId)];
                        })
                    ) as Record<TasksColumnType, TaskItem[]>
                }
            }, isSaved: false,
        }
    }),
    moveTaskItem: (taskId: string, fromCol: TasksColumnType, toCol: TasksColumnType) => set((state) => {
        if (fromCol === toCol) return state;

        const columns = state.project.data.columns;

        // Find the task to move
        const taskToMove = columns[fromCol].find((task) => task.id === taskId);

        // Not found
        if (!taskToMove) return state;

        return {
            ...state,
            project: {
                ...state.project,
                data: {
                    ...state.project.data,
                    columns: {
                        ...columns,
                        [fromCol]: columns[fromCol].filter((task) => task.id !== taskId),
                        [toCol]: [...columns[toCol], taskToMove],
                    } as Record<TasksColumnType, TaskItem[]>,
                },
            },
            isSaved: false,
        };
    }),
}));
