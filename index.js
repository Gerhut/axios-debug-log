'use strict'

var axios = require('axios')
var buildURL = require('axios/lib/helpers/buildURL')
var axiosDebug = require('debug')('axios')

const getURL = (config) => {
  return buildURL(config.url, config.params, config.paramsSerializer)
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
