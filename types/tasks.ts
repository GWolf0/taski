export interface TaskItem {
    id: string,
    text: string,
    created_at: Date,
}

export type TasksColumnType = "todo" | "doing" | "done";

export interface ProjectData {
    v: number,
    columns: Record<TasksColumnType, TaskItem[]>,
}

export interface ProjectSummary {
    title: string,
    description?: string,
    created_at: Date,
    updated_at: Date,
    todoCount: number,
    doingCount: number,
    doneCount: number,
    totalCount: number,
}