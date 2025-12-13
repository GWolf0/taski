import React, { useEffect } from 'react'

// A custom hook to perfrom an action on particular key down
function useKey(key: string, callback: () => any, deps: any[]) {

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            // console.log(e.key);
            if (e.key.toUpperCase() === key.toUpperCase()) {
                callback();
            }
        }

        window.addEventListener("keydown", onKey);

        return () => {
            window.removeEventListener("keydown", onKey);
        }
    }, [...deps]);

}

export default useKey