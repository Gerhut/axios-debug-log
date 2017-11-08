'use strict'

var axios = require('axios')
var axiosDebug = require('debug')('axios')

var options = {
  request: function (debug, config) {
    debug(config.method.toUpperCase() + ' ' + config.url)
  },
  response: function (debug, response) {
    debug(
      response.status + ' ' + response.statusText,
      '(' + response.config.method.toUpperCase() + ' ' + response.config.url + ')'
    )
  },
  error: function (debug, error) {
    if (error.config) {
      debug(
        error.name + ': ' + error.message,
        '(' + error.config.method.toUpperCase() + ' ' + error.config.url + ')'
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
