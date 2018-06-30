/// <reference types="node" />
import { Dict, Config } from './types';
import { URL } from 'url';
export declare class GitHub {
    token: string;
    debug: boolean;
    apiUrl: string;
    url: URL;
    constructor(config: Config);
    query(query: string, variables?: Dict<any>): Promise<any>;
}
export default GitHub;
