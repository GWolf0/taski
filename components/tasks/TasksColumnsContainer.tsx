"use client";

import React, { useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, } from "@dnd-kit/sortable";
import { useTasksStore } from "@/store/useTasksStore";
import TasksColumn from "./TasksColumn";
import { TasksColumnType } from "@/types/tasks";

const columns: TasksColumnType[] = ["todo", "doing", "done"];

export default function TasksColumnsContainer() {
    const { project, setProject } = useTasksStore();

    const [collapsed, setCollapsed] = useState<Record<TasksColumnType, boolean>>({ todo: false, doing: false, done: false, });

    const toggleCollapse = (col: TasksColumnType) => setCollapsed((c) => ({ ...c, [col]: !c[col] }));

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (!over) return;

        const [fromCol, fromId] = active.id.toString().split(":");
        const [toCol, toId] = over.id.toString().split(":");

        const from = fromCol as TasksColumnType;
        const to = toCol as TasksColumnType;

        // No movement
        if (from === to && fromId === toId) return;

        const newColumns = structuredClone(project.data.columns);

        const fromItems = structuredClone(newColumns[from]);
        const toItems = structuredClone(newColumns[to]);

        const fromIndex = fromItems.findIndex((i) => i.id === fromId);
        const item = fromItems[fromIndex];

        // remove from original
        fromItems.splice(fromIndex, 1);

        // reorder or insert in target
        if (from === to) {
            const toIndex = toItems.findIndex((i) => i.id === toId);
            const moved = arrayMove(toItems, fromIndex, toIndex);
            newColumns[to] = moved;
        } else {
            const toIndex = toItems.findIndex((i) => i.id === toId);
            toItems.splice(Math.max(0, toIndex), 0, item);
        }

        setProject({
            ...project,
            data: {
                ...project.data,
                columns: newColumns,
            },
        }, true); // set dirty
    };

    return (
        <main className="w-full flex flex-col md:flex-row gap-4 p-4" style={{ height: "calc(100vh - 60px)" }}>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                {columns.map((c) => (
                    <SortableContext
                        key={c}
                        items={project.data.columns[c].map((i) => `${c}:${i.id}`)}
                        strategy={verticalListSortingStrategy}
                    >
                        <TasksColumn
                            columnName={c}
                            tasks={project.data.columns[c]}
                            collapsed={collapsed[c]}
                            onToggle={() => toggleCollapse(c)}
                        />
                    </SortableContext>
                ))}
            </DndContext>
        </main>
    );
}
