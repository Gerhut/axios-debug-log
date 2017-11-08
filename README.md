# axios-debug-log

[![Greenkeeper badge](https://badges.greenkeeper.io/Gerhut/axios-debug-log.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/Gerhut/axios-debug-log.svg?branch=master)](https://travis-ci.org/Gerhut/axios-debug-log)
[![Coverage Status](https://coveralls.io/repos/github/Gerhut/axios-debug-log/badge.svg?branch=master)](https://coveralls.io/github/Gerhut/axios-debug-log?branch=master)
[![dependencies Status](https://david-dm.org/Gerhut/axios-debug-log/status.svg)](https://david-dm.org/Gerhut/axios-debug-log)
[![devDependencies Status](https://david-dm.org/Gerhut/axios-debug-log/dev-status.svg)](https://david-dm.org/Gerhut/axios-debug-log?type=dev)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

[Axios](https://www.npmjs.com/package/axios) interceptor of logging requests &amp; responses by [debug](https://www.npmjs.com/package/debug).

![Screenshot](screenshot.png "Screenshot")

## Install 

    $ npm install --save axios axios-debug-log
    
## Node.js usage

1. Install: add `require('axios-debug-log')` before any axios execution.
2. Enable: set `DEBUG=axios` environment variables before start your fantastic Node.js application.

## Browser usage

1. Install: add `require('axios-debug-log')` before any axios execution.
2. Enable: set `localStorage.debug = "axios"` before start your fantastic web application.

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

## License

MIT
