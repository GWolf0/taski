"use client";

import React from "react";
import { TaskItem, TasksColumnType } from "@/types/tasks";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="p-3 bg-card border rounded-lg shadow-sm text-sm cursor-grab active:cursor-grabbing select-none"
        >
            {item.text}
        </div>
    );
}
