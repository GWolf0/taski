// helpers for dealing with localstorage

// load from localstorage
export function localStorageLoad<T>(key: string): T | null{
    if (!window) return null;
    try {
        const raw = localStorage.getItem(key);
        if(!raw) return null;
        return JSON.parse(raw) as T;
    }catch (error: any) {
        console.error(`[localStorageLoad]: ${error.message}`);
        return null;
    }
}

// save to localstorage
export function localStorageSave(key: string, value: any): boolean{
    if (!window) return false;
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    }catch (error: any) {
        console.error(`[localStorageSave]: ${error.message}`);
        return false;
    }
}