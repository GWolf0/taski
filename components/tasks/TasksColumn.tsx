"use client";

import React, { useRef, useState } from "react";
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
    const project = useTasksStore((s) => s.project);
    const setProject = useTasksStore((s) => s.setProject);

    const inputRef = useRef<HTMLInputElement>(null);

    const [adding, setAdding] = useState(false);
    // const [text, setText] = useState("");

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
        });

        inputRef.current.value = "";
        inputRef.current.focus();
    };

    // if adding and enter pressed attempt add task
    useKey("enter", () => {
        if (adding) addTask();
    }, [adding, addTask]);
    // if adding and escape pressed cancel adding
    useKey("escape", () => {
        if (adding) setAdding(false);
    }, [adding]);

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

                    {adding ? (
                        <div className="mt-2 flex gap-1">
                            <Input
                                ref={inputRef}
                                // value={text}
                                // onChange={(e) => setText(e.target.value)}
                                placeholder="Task description..."
                                className="h-8 text-sm"
                                autoFocus
                            />
                            <Button size="icon-sm" onClick={addTask} title="[enter]">
                                <i className="bi bi-plus-lg"></i>
                            </Button>
                            <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => setAdding(false)}
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
