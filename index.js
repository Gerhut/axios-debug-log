'use strict'

var axios = require('axios')
var createDebug = require('debug')

var options = {
  namespace: 'axios',
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

function addLogger (instance) {
  var debug = createDebug(options.namespace)

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

module.exports = function (userOptions) {
  if (userOptions) {
    Object.keys(options).forEach(function (key) {
      if (userOptions[key]) {
        options[key] = userOptions[key]
      }
    })
  }

  return addLogger
}
