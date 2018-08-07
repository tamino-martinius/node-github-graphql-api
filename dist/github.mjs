import { request } from 'https';
import { parse as parseUrl, } from 'url';
export class GitHub {
    constructor(config) {
        this.apiUrl = 'https://api.github.com/graphql';
        this.token = config.token;
        if (config.apiUrl)
            this.apiUrl = config.apiUrl;
        this.url = parseUrl(this.apiUrl);
    }
    async query(query, variables) {
        const payload = {
            query,
            variables,
        };
        const payloadString = JSON.stringify(payload);
        return new Promise((resolve, reject) => {
            const req = request({
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
            }, (res) => {
                const chunks = [];
                res.on('data', (chunk) => {
                    chunks.push(chunk.toString('utf8'));
                });
                res.on('end', () => {
                    if (res.statusCode !== 200) {
                        return reject(res.statusMessage);
                    }
                    const response = chunks.join('');
                    let json;
                    try {
                        json = JSON.parse(response);
                    }
                    catch (e) {
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
            });
            req.on('error', (err) => { reject(err); });
            req.write(payloadString);
            req.end();
        });
    }
}
export default GitHub;
//# sourceMappingURL=github.mjs.map