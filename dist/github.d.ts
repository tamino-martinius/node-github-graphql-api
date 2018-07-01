/// <reference types="node" />
import { Dict, Options } from './types';
import { URL } from 'url';
export declare class GitHub {
    token: string;
    apiUrl: string;
    url: URL;
    constructor(config: Options);
    query(query: string, variables?: Dict<any>): Promise<any>;
}
export default GitHub;
