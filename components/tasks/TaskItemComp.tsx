"use client";

import React, { useEffect } from "react";
import { TaskItem, TasksColumnType } from "@/types/tasks";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTasksStore } from "@/store/useTasksStore";
import { Button } from "../ui/button";

export default function TaskItemComp({ item, columnName, }: {
    item: TaskItem; columnName: TasksColumnType
}) {
    const { triggerTaskItemEdit, deleteTaskItem, moveTaskItem, selectedTask } = useTasksStore();

    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({
            id: `${columnName}:${item.id}`,
        });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    function renderTaskTools(): React.ReactNode {
        return (
            <div className={"w-full bg-muted flex items-center justify-between gap-0.5 h-6"}>
                <div>
                    {/* // Not Today */}
                    {/* <Button size={"sm"} className="h-6 text-xs hover:underline text-muted-foreground" variant={"ghost"} title="add sub-item">
                        <i className="bi bi-plus-lg"></i> subitem
                    </Button> */}
                    <p className="text-xs scale-75 text-muted-foreground">
                        {new Date(item.created_at).toISOString().substring(0, 10)}
                    </p>
                </div>

                <div>
                    <Button size={"icon-sm"} className="h-6 text-xs text-muted-foreground" variant={"ghost"} title="move left"
                        onClick={() =>
                            moveTaskItem(item.id, columnName, columnName === "done" ? "doing" : columnName === "doing" ? "todo" : "todo")
                        }
                    >
                        <i className="bi bi-arrow-left"></i>
                    </Button>
                    <Button size={"icon-sm"} className="h-6 text-xs text-muted-foreground" variant={"ghost"} title="move right"
                        onClick={() =>
                            moveTaskItem(item.id, columnName, columnName === "todo" ? "doing" : columnName === "doing" ? "done" : "done")
                        }
                    >
                        <i className="bi bi-arrow-right"></i>
                    </Button>
                    <Button size={"icon-sm"} className="h-6 text-xs text-muted-foreground" variant={"ghost"} title="edit"
                        onClick={() => triggerTaskItemEdit({ id: item.id, column: columnName })}
                    >
                        <i className="bi bi-pen"></i>
                    </Button>
                    <Button size={"icon-sm"} className="h-6 text-xs text-muted-foreground" variant={"ghost"} title="remove"
                        onClick={() => deleteTaskItem(item.id)}
                    >
                        <i className="bi bi-x-lg"></i>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={`bg-card border rounded-lg shadow-sm text-sm cursor-grab active:cursor-grabbing select-none overflow-hidden ${selectedTask?.id === item.id && "border-primary"}`}
        >
            <p className="w-full p-3 text-sm md:text-sm"
                {...listeners}
            >
                {item.text}
            </p>

            {renderTaskTools()}
        </div>
    );
}
