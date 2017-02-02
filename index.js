'use strict'

var axios = require('axios')
var debug = require('debug')('axios')

axios.interceptors.request.use(function (config) {
  debug(config.method.toUpperCase() + ' ' + config.url, config.headers)
  return config
})

axios.interceptors.response.use(function (response) {
  debug(response.status + ' ' + response.statusText, response.headers)
  return response
})
