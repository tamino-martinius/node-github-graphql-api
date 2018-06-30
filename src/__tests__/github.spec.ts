import { context } from './types';
import {
  GitHub,
  Dict,
} from '../';
import https from 'https';
import { dedent } from 'ts-dedent';

jest.mock('https');
let responseStatus: number = 902;
let responseString: string | undefined = undefined;
let responseJson: Dict<any> = {};
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
  return {
    write(str) {
      requestString += `\n${str}`;
      curlString += ` --data '${str}'`;
    },
    on(event, cb) {
    },
    end() {
      // console.log(curlString);

      if (callbacks.data) {
        if (responseString) {
          callbacks.data(responseString);
        } else {
          callbacks.data(JSON.stringify(responseJson));
        }
        callbacks.end();
      }
    },
  };
};

/// @ts-ignore
https.request.mockImplementation(requestMock);

beforeEach(() => {
  responseStatus = 902;
  responseString = undefined;
  responseJson = {};
  requestString = '';
  curlString = '';
});

describe('GitHub', () => {
  const token: string = 'token123';
  let debug: boolean | undefined = false;
  let apiUrl: string | undefined = undefined;

  beforeEach(() => {
    debug = false;
    apiUrl = undefined;
  });

  const gitHubFactory = () => new GitHub({ token, debug, apiUrl });

  describe('.new', () => {
    const subject = () => {
      return gitHubFactory();
    };

    it('uses default values', () => {
      const github = subject();
      expect(github.token).toEqual(token);
      expect(github.debug).toEqual(false);
      expect(github.apiUrl).toEqual('https://api.github.com/graphql');
    });

    context('when debug is set', {
      definitions() {
        debug = true;
      },
      tests() {
        it('returns passed value', () => {
          const github = subject();
          expect(github.debug).toEqual(debug);
        });
      },
    });

    context('when apiUrl is set', {
      definitions() {
        apiUrl = 'https://example.com';
      },
      tests() {
        it('returns passed value', () => {
          const github = subject();
          expect(github.apiUrl).toEqual(apiUrl);
        });
      },
    });

    context('when apiUrl is invalid', {
      definitions() {
        apiUrl = 'foo';
      },
      tests() {
        it('throws error', () => {
          expect(subject).toThrow();
        });
      },
    });
  });

  describe('#query', () => {
    let query: string = '';
    let variables: Dict<any> | undefined = undefined;

    const subject = () => {
      return gitHubFactory().query(query, variables);
    };

    it('makes call with query to GitHub API', async () => {
      try {
        await subject();
      } catch (error) {
        // Just check if the request was made
      }
      expect(requestString).toEqual(dedent`
        POST https://api.github.com/graphql
        {"query":""}
      `);
    });

    context('when variables are present', {
      definitions() {
        variables = {
          foo: 'bar',
        };
      },
      tests() {
        it('makes call with variables to GitHub API', async () => {
          try {
            await subject();
          } catch (error) {
            // Just check if the request was made
          }
          expect(requestString).toEqual(dedent`
            POST https://api.github.com/graphql
            {"query":"","variables":{"foo":"bar"}}
          `);
        });
      },
    });

    context('when query valid', {
      definitions() {
        query = `
          query {
            user(login: "tamino-martinius") {
              name
            }
          }
        `;
        variables = undefined;
        responseStatus = 200;
        responseJson = {
          data: {
            user: {
              name: 'Tamino Martinius',
            },
          },
        };
      },
      tests() {
        it('returns data', async () => {
          const data = await subject();
          expect(data).toEqual(responseJson.data);
        });
      },
    });

    context('when query is empty', {
      definitions() {
        query = '';
        variables = undefined;
        responseStatus = 200;
        responseJson = {
          data: null,
          errors: [{
            message: 'A query attribute must be specified and must be a string.',
          }],
        };
      },
      tests() {
        it('throws errors', async () => {
          try {
            const res = await subject();
          } catch (error) {
            expect(error).toEqual(responseJson.errors);
          }
        });
      },
    });

    context('when response is malformed', {
      definitions() {
        query = '';
        variables = undefined;
        responseStatus = 200;
        responseString = 'foo';
      },
      tests() {
        it('throws errors', async () => {
          try {
            const res = await subject();
          } catch (error) {
            expect(error).toEqual('GitHub GraphQL API response is not able to be parsed as JSON');
          }
        });
      },
    });

    context('when response does not contain data attribute', {
      definitions() {
        query = '';
        variables = undefined;
        responseStatus = 200;
        responseJson = {};
      },
      tests() {
        it('throws errors', async () => {
          try {
            const res = await subject();
          } catch (error) {
            expect(error).toEqual('Unknown GraphQL error');
          }
        });
      },
    });
  });
});
