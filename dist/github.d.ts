/// <reference types="node" />
import { Dict, Options } from './types';
import { UrlWithStringQuery } from 'url';
export declare class GitHub {
    token: string;
    apiUrl: string;
    url: UrlWithStringQuery;
    constructor(config: Options);
    query(query: string, variables?: Dict<any>): Promise<any>;
}
export default GitHub;
