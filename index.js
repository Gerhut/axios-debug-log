'use strict'

var axios = require('axios')
var isAbsoluteURL = require('axios/lib/helpers/isAbsoluteURL')
var buildURL = require('axios/lib/helpers/buildURL')
var combineURLs = require('axios/lib/helpers/combineURLs')
var axiosDebug = require('debug')('axios')

var URL_KEY = '__AXIOS-DEBUG-LOG_URL__'

function getURL (config) {
  var url = config.url
  if (config.baseURL && !isAbsoluteURL(url)) {
    url = combineURLs(config.baseURL, url)
  }
  return buildURL(url, config.params, config.paramsSerializer)
}

var options = {
  request: function (debug, config) {
    var url = getURL(config)
    Object.defineProperty(config, URL_KEY, { value: url })
    debug(
      config.method.toUpperCase() + ' ' + url
    )
  },
  response: function (debug, response) {
    var url = response.config[URL_KEY]
    debug(
      response.status + ' ' + response.statusText,
      '(' + response.config.method.toUpperCase() + ' ' + url + ')'
    )
  },
  error: function (debug, error) {
    if (error.config) {
      var url = error.config[URL_KEY]
      debug(
        error.name + ': ' + error.message,
        '(' + error.config.method.toUpperCase() + ' ' + url + ')'
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
