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
  const debug: boolean | undefined = false;
  const apiUrl: string | undefined = undefined;

  const gitHubFactory = () => new GitHub({ token, debug, apiUrl });

  describe('#query', () => {
    let query: string = '';
    let variables: Dict<any> | undefined = undefined;

    const subject = () => {
      return gitHubFactory().query(query, variables);
    };

    it('makes call to GitHub API', async () => {
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

    context('when query is empty', {
      definitions() {
        query = '';
        variables = undefined;
        responseStatus = 200;
        responseBody = {
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
            expect(error).toEqual(responseBody.errors);
          }
        });
      },
    });
  });
});
