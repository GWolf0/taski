"use client";

import React, { useState } from "react";
import { TasksColumnType, TaskItem } from "@/types/tasks";
import TaskItemComp from "./TaskItemComp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTasksStore } from "@/store/useTasksStore";

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

    const [adding, setAdding] = useState(false);
    const [text, setText] = useState("");

    const addTask = () => {
        if (!text.trim()) return;

        const newTask: TaskItem = {
            id: crypto.randomUUID(),
            text: text.trim(),
            created_at: new Date(),
        };

        const newColumns = structuredClone(project.data.columns);
        newColumns[columnName].push(newTask);

        setProject({
            ...project,
            data: {
                ...project.data,
                columns: newColumns,
            },
        });

        setText("");
        setAdding(false);
    };

    return (
        <section className="w-full md:w-1/3 bg-background border rounded-xl p-3 shadow-sm">
            <header className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-lg">{labels[columnName]}</h2>

                <button
                    onClick={onToggle}
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    {collapsed ? "Expand" : "Collapse"}
                </button>
            </header>

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
                        <div className="mt-2 flex gap-2">
                            <Input
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Task description..."
                                className="h-8"
                            />
                            <Button size="sm" onClick={addTask}>
                                Add
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setAdding(false)}
                            >
                                Cancel
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
