import axios from 'axios';
import debug from 'debug';
import config, { addLogger } from '.';

config({
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

var github = axios.create({ baseURL: 'https://api.github.com/' })
var githubLogger = debug('github')
addLogger(github, githubLogger)
github('/user')
