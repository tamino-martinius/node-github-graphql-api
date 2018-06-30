import {
  Dict,
  Config,
} from './types';
import { request } from 'https';
import { URL } from 'url';

export class GitHub {
  token: string;
  debug: boolean = false;
  apiUrl: string = 'https://api.github.com/graphql';
  url: URL;

  constructor(config: Config) {
    this.token = config.token;
    if (config.debug) this.debug = config.debug;
    if (config.apiUrl) this.apiUrl = config.apiUrl;
    this.url = new URL(this.apiUrl);
  }

}

export default GitHub;
