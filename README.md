# axios-debug-log

[![Node.js CI](https://github.com/Gerhut/axios-debug-log/actions/workflows/ci.yaml/badge.svg)](https://github.com/Gerhut/axios-debug-log/actions/workflows/ci.yaml)
[![Coverage Status](https://coveralls.io/repos/github/Gerhut/axios-debug-log/badge.svg?branch=master)](https://coveralls.io/github/Gerhut/axios-debug-log?branch=master)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

[Axios](https://www.npmjs.com/package/axios) interceptor of logging requests &amp; responses by [debug](https://www.npmjs.com/package/debug).

![Screenshot](screenshot.png "Screenshot")

## Install

    $ npm install --save axios axios-debug-log

## Node.js usage

> 1. Install: add `require('axios-debug-log')` before any axios execution.
> 2. Enable: set `DEBUG=axios` environment variables before start your fantastic Node.js application.

Or

> Add `require('axios-debug-log/enable')` before any axios execution
> to install and enable.

Or

> Run DEBUG=axios node --require axios-debug-log \[entrypoint.js\]

Or

> Run node --require axios-debug-log/enable \[entrypoint.js\]

## Browser usage

> 1. Install: add `require('axios-debug-log')` before any axios execution.
> 2. Enable: set `localStorage.debug = "axios"` before start your fantastic web application.

Or

> Add `require('axios-debug-log/enable')` before any axios execution
> to install and enable.

Please read [README of debug](https://github.com/visionmedia/debug#readme) for usage details.

## Configuration

```javascript
// Log content type
require('axios-debug-log')({
  request: function (debug, config) {
    debug('Request with ' + config.headers['content-type'])
  },
  response: function (debug, response) {
    debug(
      'Response with ' + response.headers['content-type'],
      'from ' + response.config.url
    )
  },
  error: function (debug, error) {
    // Read https://www.npmjs.com/package/axios#handling-errors for more info
    debug('Boom', error)
  }
})
```

## Customization

Use `require('axios-debug-log').addLogger(instance, debug)` to add custom debug
logger to custom instance.

```javascript
var github = axios.create({ baseURL: 'https://api.github.com/' })
var githubLogger = require('debug')('github')
require('axios-debug-log').addLogger(github, githubLogger)
github('/user')
```

## Trust by

[![octokit](https://avatars2.githubusercontent.com/u/3430433?s=200)](https://github.com/octokit)
[![SlackAPI](https://avatars3.githubusercontent.com/u/6962987?s=200)](https://github.com/slackapi)
[![Center for Public Integrity](https://avatars3.githubusercontent.com/u/459758?s=200)](https://github.com/PublicI)
[![AppImage](https://avatars0.githubusercontent.com/u/16617932?s=200)](https://github.com/AppImage)
[![pytorch](https://avatars0.githubusercontent.com/u/21003710?s=200)](https://github.com/pytorch)

*And Yours...*

## License

MIT
