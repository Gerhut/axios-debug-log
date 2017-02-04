'use strict'

var axios = require('axios')
var debug = require('debug')('axios')

function logRequest (config) {
  debug(config.method.toUpperCase() + ' ' + config.url)
  return config
}

function logResponse (response) {
  debug(
    response.status + ' ' + response.statusText,
    '(' + response.config.method.toUpperCase() + ' ' + response.config.url + ')'
  )
  return response
}

function addLogger (instance) {
  instance.interceptors.request.use(logRequest)
  instance.interceptors.response.use(logResponse)
}

addLogger(axios)

axios.create = (function (originalCreate) {
  return function create () {
    var instance = originalCreate.apply(axios, arguments)
    addLogger(instance)
    return instance
  }
})(axios.create)
