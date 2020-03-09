'use strict'

var axios = require('axios')
var isAbsoluteURL = require('axios/lib/helpers/isAbsoluteURL')
var combineURLs = require('axios/lib/helpers/combineURLs')
var buildURL = require('axios/lib/helpers/buildURL')
var axiosDebug = require('debug')('axios')

var buildFullPath;
try {
  buildFullPath = require('axios/lib/core/buildFullPath')
} catch(err) {
  /**
   * Copy paste from Axios because it appears only in version 0.19.1
   * @see https://github.com/axios/axios/blob/v0.19.1/lib/core/buildFullPath.js
   */
  buildFullPath = (baseURL, requestedURL) => {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
      return combineURLs(baseURL, requestedURL)
    }
    return requestedURL
  }
}

const getURL = (config) => {
  const fullURL = buildFullPath(config.baseURL, config.url)
  return buildURL(fullURL.toString(), config.params, config.paramsSerializer)
}

var options = {
  request: function (debug, config) {
    debug(
      config.method.toUpperCase() + ' ' + getURL(config)
    )
  },
  response: function (debug, response) {
    debug(
      response.status + ' ' + response.statusText,
      '(' + response.config.method.toUpperCase() + ' ' + getURL(response.config) + ')'
    )
  },
  error: function (debug, error) {
    if (error.config) {
      debug(
        error.name + ': ' + error.message,
        '(' + error.config.method.toUpperCase() + ' ' + getURL(error.config) + ')'
      )
    } else {
      debug(error.name + ': ' + error.message)
    }
  }
}

function addLogger (instance, debug) {
  if (debug === undefined) debug = axiosDebug
  instance.interceptors.request.use(function (config) {
    options.request(debug, config)
    return config
  })
  instance.interceptors.response.use(function (response) {
    options.response(debug, response)
    return response
  }, function (error) {
    options.error(debug, error)
    throw error
  })
}

addLogger(axios)

axios.create = (function (originalCreate) {
  return function create () {
    var instance = originalCreate.apply(this, arguments)
    addLogger(instance)
    return instance
  }
})(axios.create)

exports = module.exports = function (userOptions) {
  for (var key in options) {
    if (key in userOptions) {
      options[key] = userOptions[key]
    }
  }
}

exports.addLogger = addLogger
