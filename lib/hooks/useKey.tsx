'use client'

import { useEffect } from 'react'

type ModifierKey = 'ctrl' | 'shift' | 'alt';

// A custom hook to perform an action on particular key down
function useKey(key: string, callback: () => void, deps: any[] = [], secondaryKey?: ModifierKey, preventDefault?: boolean) {
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (!e.key) return;

            const mainKeyMatch = e.key.toUpperCase() === key.toUpperCase();

            if (!mainKeyMatch) return;

            // No modifier required
            if (!secondaryKey) {
                if (preventDefault) e.preventDefault();
                callback();
                return;
            }

            const modifierMatch =
                (secondaryKey === 'ctrl' && (e.ctrlKey || e.metaKey)) ||
                (secondaryKey === 'shift' && e.shiftKey) ||
                (secondaryKey === 'alt' && e.altKey);

            if (!modifierMatch) return;

            if (preventDefault) e.preventDefault();
            callback();
        }

        if (typeof window !== 'undefined') window.addEventListener('keydown', onKey);

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('keydown', onKey);
            }
        }
    }, [key, secondaryKey, preventDefault, callback, ...deps]);

}

export default useKey
