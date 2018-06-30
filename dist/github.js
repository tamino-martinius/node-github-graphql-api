"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var https_1 = require("https");
var url_1 = require("url");
var GitHub = (function () {
    function GitHub(config) {
        this.debug = false;
        this.apiUrl = 'https://api.github.com/graphql';
        this.token = config.token;
        if (config.debug)
            this.debug = config.debug;
        if (config.apiUrl)
            this.apiUrl = config.apiUrl;
        this.url = new url_1.URL(this.apiUrl);
    }
    GitHub.prototype.query = function (query, variables) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, payloadString;
            var _this = this;
            return __generator(this, function (_a) {
                payload = {
                    query: query,
                    variables: variables,
                };
                payloadString = JSON.stringify(payload);
                return [2, new Promise(function (resolve, reject) {
                        var req = https_1.request({
                            hostname: _this.url.hostname,
                            path: _this.url.pathname,
                            method: 'POST',
                            protocol: _this.url.protocol,
                            headers: {
                                'Content-Type': 'application/json',
                                'Content-Length': payloadString.length,
                                Authorization: 'bearer ' + _this.token,
                                'User-Agent': 'GitHub GraphQL Client',
                            },
                        }, function (res) {
                            var chunks = [];
                            res.on('data', function (chunk) {
                                chunks.push(chunk.toString('utf8'));
                            });
                            res.on('end', function () {
                                if (res.statusCode !== 200) {
                                    return reject(res.statusMessage);
                                }
                                var response = chunks.join('');
                                var json;
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
                                return resolve(json);
                            });
                        });
                        req.on('error', function (err) { reject(err); });
                        req.write(payloadString);
                        req.end();
                    })];
            });
        });
    };
    return GitHub;
}());
exports.GitHub = GitHub;
exports.default = GitHub;
//# sourceMappingURL=github.js.map