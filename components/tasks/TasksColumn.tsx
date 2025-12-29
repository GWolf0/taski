"use client";

import React, { useEffect, useRef, useState } from "react";
import { TasksColumnType, TaskItem } from "@/types/tasks";
import TaskItemComp from "./TaskItemComp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTasksStore } from "@/store/useTasksStore";
import { TaskService } from "@/services/systems/taskService";
import z from "zod";
import useKey from "@/lib/hooks/useKey";

const labels: Record<TasksColumnType, string> = {
    todo: "To Do",
    doing: "Doing",
    done: "Done",
};

export default function TasksColumn({ columnName, tasks, collapsed, onToggle }: {
    columnName: TasksColumnType; tasks: TaskItem[]; collapsed: boolean; onToggle: () => void
}) {
    const { project, setProject, editSelectedTaskItem, selectedTask, triggerTaskItemEdit } = useTasksStore();

    const inputRef = useRef<HTMLInputElement>(null);

    const [adding, setAdding] = useState(false);

    useEffect(() => {
        // if selectedTask is not undefinded (means a task is selected for edit), then turn adding off
        if (selectedTask != undefined) setAdding(false);
    }, [selectedTask]);

    const addTask = () => {
        if (!inputRef.current) return;
        const text: string = inputRef.current.value.trim();

        const parsed = z.object({ text: z.string().min(1).max(128) }).safeParse({ text: text.trim() });
        if (parsed.error) return;

        const newTask = TaskService.makeNewTaskItem(parsed.data.text);

        const newColumns = structuredClone(project.data.columns);
        newColumns[columnName].push(newTask);

        setProject({
            ...project,
            data: {
                ...project.data,
                columns: newColumns,
            },
        }, true);

        inputRef.current.value = "";
        inputRef.current.focus();
    };

    function editTask() {
        if (!inputRef.current) return;
        const text: string = inputRef.current.value.trim();

        const parsed = z.object({ text: z.string().min(1).max(128) }).safeParse({ text: text.trim() });
        if (parsed.error) return;

        editSelectedTaskItem(parsed.data.text);
    }

    // if adding and enter pressed attempt add task
    useKey("enter", () => {
        if (adding) addTask();
        if (selectedTask != undefined) editTask();
    }, [adding, selectedTask, addTask]);
    // if adding and escape pressed cancel adding
    useKey("escape", () => {
        if (adding) setAdding(false);
        if (selectedTask != undefined) triggerTaskItemEdit(undefined);
    }, [adding, selectedTask]);

    return (
        <section className="w-full md:w-1/3 bg-background border rounded-xl p-3 shadow-sm">
            <section className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-lg">
                    {labels[columnName]} - <span className="text-muted-foreground text-base">({tasks.length})</span>
                </h2>

                <button
                    onClick={onToggle}
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    {collapsed ? "Expand" : "Collapse"}
                </button>
            </section>

            {!collapsed && (
                <div className="flex flex-col gap-2">
                    {tasks.length === 0 && (
                        <div className="text-sm text-muted-foreground">No tasks.</div>
                    )}

                    {tasks.map((task) => (
                        <TaskItemComp
                            key={task.id}
                            item={task}
                            columnName={columnName}
                        />
                    ))}

                    {adding || (selectedTask != undefined && selectedTask.column === columnName) ? (
                        <div className="mt-2 flex gap-1">
                            <Input
                                ref={inputRef}
                                placeholder={adding ? "Task description..." : "Edit task"}
                                className="h-8 text-sm"
                                defaultValue={tasks.find(t => t.id === selectedTask?.id)?.text}
                                autoFocus
                            />
                            <Button size="icon-sm"
                                onClick={() => { if (adding) addTask(); else editTask(); }}
                                title="[enter]"
                            >
                                {adding ?
                                    <i className="bi bi-plus-lg"></i>
                                    :
                                    <i className="bi bi-pencil"></i>
                                }
                            </Button>
                            <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => { if (adding) setAdding(false); else triggerTaskItemEdit(undefined); }}
                                title="[escape]"
                            >
                                <i className="bi bi-x-lg"></i>
                            </Button>
                        </div>
                    ) : (
                        <Button
                            size="sm"
                            variant="secondary"
                            className="mt-3"
                            onClick={() => setAdding(true)}
                        >
                            + Add Task
                        </Button>
                    )}
                </div>
            )}
        </section>
    );
}
