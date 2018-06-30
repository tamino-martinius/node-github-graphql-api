export interface Dict<T> {
  [key: string]: T;
}

export interface Config {
  token: string;
  debug: boolean | undefined;
  apiUrl: string | undefined;
}
