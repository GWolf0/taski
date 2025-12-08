export type JSONType = {[key: string]: any};

export type MError = {
    code?: string,
    message?: string,
    errors?: JSONType,
} | undefined | null;

// Data or error
export interface DOE<T=any> {
    data?: T | null,
    error: MError,
}
export function DOE_EMPTY(): DOE { return {data: null, error: undefined} }