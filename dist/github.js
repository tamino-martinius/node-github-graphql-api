"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = require("https");
const url_1 = require("url");
class GitHub {
    constructor(config) {
        this.apiUrl = 'https://api.github.com/graphql';
        this.token = config.token;
        if (config.apiUrl)
            this.apiUrl = config.apiUrl;
        this.url = url_1.parse(this.apiUrl);
    }
    query(query, variables) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                query,
                variables,
            };
            const payloadString = JSON.stringify(payload);
            return new Promise((resolve, reject) => {
                const req = https_1.request({
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
        });
    }
}
exports.GitHub = GitHub;
exports.default = GitHub;
//# sourceMappingURL=github.js.map