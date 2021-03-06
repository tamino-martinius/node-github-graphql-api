import {
  Dict,
  Options,
} from './types';
import { request } from 'https';
import {
  parse as parseUrl,
  UrlWithStringQuery,
} from 'url';

export class GitHub {
  token: string;
  apiUrl: string = 'https://api.github.com/graphql';
  url: UrlWithStringQuery;

  constructor(config: Options) {
    this.token = config.token;
    if (config.apiUrl) this.apiUrl = config.apiUrl;
    this.url = parseUrl(this.apiUrl);
  }

  public async query(query: string, variables?: Dict<any>): Promise<any> {
    const payload = {
      query,
      variables,
    };

    const payloadString = JSON.stringify(payload);

    return new Promise((resolve, reject) => {
      const req = request(
        {
          hostname: this.url.hostname,
          path: this.url.pathname,
          method: 'POST',
          protocol: this.url.protocol,
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': payloadString.length,
            Authorization: 'bearer ' + this.token,
            'User-Agent': 'GitHub GraphQL Client',
          },
        },
        (res) => {
          const chunks: string[] = [];

          res.on('data', (chunk) => {
            chunks.push((<Buffer>chunk).toString('utf8'));
          });

          res.on('end', () => {
            if (res.statusCode !== 200) {
              return reject(res.statusMessage);
            }

            const response = chunks.join('');
            let json: any;

            try {
              json = JSON.parse(response);
            } catch (e) {
              return reject('GitHub GraphQL API response is not able to be parsed as JSON');
            }

            if (!json.data) {
              if (json.errors) {
                return reject(json.errors);
              }
              return reject('Unknown GraphQL error');
            }

            return resolve(json.data);
          });
        },
      );

      req.on('error', (err) => { reject(err); });
      req.write(payloadString);
      req.end();
    });
  }
}

export default GitHub;
