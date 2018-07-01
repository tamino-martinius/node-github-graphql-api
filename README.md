# GitHub GraphQL API

[![Build Status](https://travis-ci.org/tamino-martinius/node-github-graphql-api.svg?branch=master)](https://travis-ci.org/tamino-martinius/node-github-graphql-api)
[![codecov](https://codecov.io/gh/tamino-martinius/node-github-graphql-api/branch/master/graph/badge.svg)](https://codecov.io/gh/tamino-martinius/node-github-graphql-api)

A node client for the GitHub GraphQL API with minimal dependencies created with TypeScript.

## Table of contents


## Simple Queries

With this package you can more or less just copy and paste the query and the variables from the [GitHub GraphQL Explorer](https://developer.github.com/v4/explorer/) for immediate results.

```js
import { GitHub } from 'github-graphql-api';
const github = new GitHub({ token: 'xxx' })
github.query(`
  query {
    rateLimit {
      remaining
    }
  }
`).then(console.log);
```

## Passing variables

With this package you can more or less just copy and paste the query and the variables from the [GitHub GraphQL Explorer](https://developer.github.com/v4/explorer/) for immediate results.

```js
import { GitHub } from 'github-graphql-api';
const github = new GitHub({ token: 'xxx' })

const getUserBio = async (username) => {
  return await github.query(`
    query (
      $username: String!
    ) {
      user(login: $username) {
        bio
      }
    }
  `, {
    username,
  });
}
```

## Constructor options

```js
new GitHub({
  token: 'xxx',                  // required
  apiUrl: 'https://example.com', // default: https://api.github.com/graphql
})
```

The GitHub API Token can be created on your [Developer Settings page](https://github.com/settings/tokens). You are able to define the Permissions of the Access Token.

The Api URL can be changed for GitHub Enterprise Users which run them on their own domain.

## Require / Import

```js
// ES6
import { GitHub } from 'github-graphql-api';
import GithubGraphQLApi from 'github-graphql-api';
// CommonJs
const { Github } = require('github-graphql-api');
const GithubGraphQLApi = require('github-graphql-api').default;
```

## Changelog

See [history](HISTORY.md) for more details.

* `1.0.0` **2018-07-01** Initial release
