"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

/**
 * Allow editing a text item when double click
 * Confirms on enter key
 * Cancels on escape or blur
 */
function EditableLabel({ text, onConfirmed, onCanceled }: {
    text: string; onConfirmed: (newText: string) => any; onCanceled?: (canceledText: string) => any;
}) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(text);
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Focus the input when editing starts
    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editing]);

    const handleConfirm = () => {
        setEditing(false);
        if (value.trim() !== text) {
            onConfirmed(value.trim());
        }
    };

    const handleCancel = () => {
        setEditing(false);
        setValue(text);
        onCanceled?.(text);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleConfirm();
        } else if (e.key === "Escape") {
            handleCancel();
        }
    };

    return (
        <div className="inline-block">
            {editing ? (
                <input
                    ref={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={handleCancel}
                    onKeyDown={handleKeyDown}
                    className="h-8 px-2 py-1 text-sm outline-none underline"
                />
            ) : (
                <span
                    className="cursor-pointer select-none hover:bg-muted px-1 rounded-sm transition text-sm font-medium"
                    onDoubleClick={() => setEditing(true)}
                    title={"[dbl-click] edit"}
                >
                    {text}
                </span>
            )}
        </div>
    );
}

export default EditableLabel;
