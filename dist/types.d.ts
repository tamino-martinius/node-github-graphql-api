export interface Dict<T> {
    [key: string]: T;
}
export interface Options {
    token: string;
    apiUrl: string | undefined;
}
