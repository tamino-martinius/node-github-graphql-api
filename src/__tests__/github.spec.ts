import { context } from './types';
import {
  GitHub,
  Dict,
} from '../';
import https from 'https';
import { dedent } from 'ts-dedent';

jest.mock('https');
let responseStatus: number = 902;
let responseBody: Dict<any> = {};
let requestString: string = '';
let curlString: string = '';

const requestMock = function (options, cb) {
  let url = `${options.protocol}//`;
  if (options.auth) url += `${options.auth}@`;
  url += options.hostname;
  if (options.port) url += `:${options.port}`;
  url += options.path;
  curlString +=
    `curl --request ${options.method} --url '${url}' --header 'Content-Type: application/json'` +
    ` --header 'Accept: application/json'`
  ;
  requestString = `${options.method} ${url}`;
  const callbacks: Dict<any> = {};
  cb({
    on(event, cb) {
      callbacks[event] = cb;
    },
    statusCode: responseStatus,
  });
  this.write = (str) => {
    requestString += `\n${str}`;
    curlString += ` --data '${str}'`;
  };
  this.end = () => {
    if (callbacks.data) {
      callbacks.data(JSON.stringify(responseBody));
      callbacks.end();
    }
  };
  return this;
};

/// @ts-ignore
https.request.mockImplementation(requestMock);

beforeEach(() => {
  responseStatus = 902;
  responseBody = {};
  requestString = '';
  curlString = '';
});

