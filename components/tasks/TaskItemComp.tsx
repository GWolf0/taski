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
            <div className="w-full bg-muted flex items-center justify-between gap-0.5 h-6">
                <div>
                    <Button size={"sm"} className="h-6 text-xs hover:underline text-muted-foreground" variant={"ghost"} title="add sub-item">
                        <i className="bi bi-plus-lg"></i> subitem
                    </Button>
                </div>
                
                <div>
                    <Button size={"icon-sm"} className="h-6 text-xs text-muted-foreground" variant={"ghost"} title="move left">
                        <i className="bi bi-arrow-left"></i>
                    </Button>
                    <Button size={"icon-sm"} className="h-6 text-xs text-muted-foreground" variant={"ghost"} title="move right">
                        <i className="bi bi-arrow-right"></i>
                    </Button>
                    <Button size={"icon-sm"} className="h-6 text-xs text-muted-foreground" variant={"ghost"} title="edit">
                        <i className="bi bi-pen"></i>
                    </Button>
                    <Button size={"icon-sm"} className="h-6 text-xs text-muted-foreground" variant={"ghost"} title="remove">
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
            {...listeners}
            className={`bg-card border rounded-lg shadow-sm text-sm cursor-grab active:cursor-grabbing select-none overflow-hidden`}
        >
            <p className="w-full p-3 text-sm md:text-sm">
                {item.text}
            </p>

            { renderTaskTools() }
        </div>
    );
}
