/* eslint-env mocha */

const axios = require('axios')
const debug = require('debug')
const sinon = require('sinon')

before(() => {
  debug.enable('axios')
  debug.formatArgs = args => args
  require('.')
})

beforeEach(() => {
  debug.log = sinon.spy()
})

it('should log request', () => axios({
  method: 'FOO',
  url: 'http://example.com/',
  adapter: config => Promise.resolve({
    status: 200,
    statusText: 'BAR',
    config
  })
}).then(() => {
  debug.log.should.be.calledTwice()
  debug.log.firstCall.should.be.calledWithExactly(
    'FOO http://example.com/'
  )
  debug.log.secondCall.should.be.calledWithExactly(
    '200 BAR', '(FOO http://example.com/)'
  )
}))

it('should log the url with baseURL', () => axios({
  method: 'FOO',
  baseURL: '/foo',
  url: '/bar',
  adapter: config => Promise.resolve({
    status: 200,
    statusText: 'BAR',
    config
  })
}).then(() => {
  debug.log.should.be.calledTwice()
  debug.log.firstCall.should.be.calledWithExactly(
    'FOO /foo/bar'
  )
  debug.log.secondCall.should.be.calledWithExactly(
    '200 BAR', '(FOO /foo/bar)'
  )
}))

it('should log request error', () => axios({
  method: 'FOO',
  url: 'http://example.com/',
  adapter: config => Promise.reject(Object.assign(TypeError('Boom'), { config }))
}).catch(() => {
  debug.log.should.be.calledTwice()
  debug.log.firstCall.should.be.calledWithExactly(
    'FOO http://example.com/'
  )
  debug.log.secondCall.should.be.calledWithExactly(
    'TypeError: Boom', '(FOO http://example.com/)'
  )
}))

it('should log query params of request in error', () => axios({
  method: 'FOO',
  url: 'http://example.com/',
  params: {
    name: 'value'
  },
  adapter: config => Promise.reject(Object.assign(TypeError('Boom'), { config }))
}).catch(() => {
  debug.log.should.be.calledTwice()
  debug.log.firstCall.should.be.calledWithExactly(
    'FOO http://example.com/?name=value'
  )
  debug.log.secondCall.should.be.calledWithExactly(
    'TypeError: Boom', '(FOO http://example.com/?name=value)'
  )
}))

it('should log general error', () => axios({
  method: 'FOO',
  url: 'http://example.com/',
  transformRequest: () => { throw ReferenceError('Boom') }
}).catch(() => {
  debug.log.should.be.calledTwice()
  debug.log.firstCall.should.be.calledWithExactly(
    'FOO http://example.com/'
  )
  debug.log.secondCall.should.be.calledWithExactly(
    'ReferenceError: Boom'
  )
}))

it('should log request of axios instance', () => axios.create()({
  method: 'BAZ',
  url: 'http://example.com/',
  adapter: config => Promise.resolve({
    status: 200,
    statusText: 'QUX',
    config
  })
}).then(() => {
  debug.log.should.be.calledTwice()
  debug.log.firstCall.should.be.calledWithExactly(
    'BAZ http://example.com/'
  )
  debug.log.secondCall.should.be.calledWithExactly(
    '200 QUX', '(BAZ http://example.com/)'
  )
}))

it('should log params of the request of axios instance', () => axios.create()({
  method: 'GET',
  url: 'http://example.com/',
  params: {
    name: 'value'
  },
  adapter: config => Promise.resolve({
    status: 200,
    statusText: 'BAR',
    config
  })
}).then(() => {
  debug.log.should.be.calledTwice()
  debug.log.firstCall.should.be.calledWithExactly(
    'GET http://example.com/?name=value'
  )
  debug.log.secondCall.should.be.calledWithExactly(
    '200 BAR', '(GET http://example.com/?name=value)'
  )
}))

it('should use axios default params when logging the URL', () => axios.create({
  params: {
    foo: 'bar'
  }
})({
  method: 'GET',
  url: 'http://example.com/',
  params: {
    baz: 'qux'
  },
  adapter: config => Promise.resolve({
    status: 200,
    statusText: 'BAR',
    config
  })
}).then(() => {
  debug.log.should.be.calledTwice()
  debug.log.firstCall.should.be.calledWithExactly(
    'GET http://example.com/?foo=bar&baz=qux'
  )
  debug.log.secondCall.should.be.calledWithExactly(
    '200 BAR', '(GET http://example.com/?foo=bar&baz=qux)'
  )
}))

it('should log params from both the url and the params of the request', () => axios.create()({
  method: 'GET',
  url: 'http://example.com/?foo=bar',
  params: {
    name: 'value'
  },
  adapter: config => Promise.resolve({
    status: 200,
    statusText: 'BAR',
    config
  })
}).then(() => {
  debug.log.should.be.calledTwice()
  debug.log.firstCall.should.be.calledWithExactly(
    'GET http://example.com/?foo=bar&name=value'
  )
  debug.log.secondCall.should.be.calledWithExactly(
    '200 BAR', '(GET http://example.com/?foo=bar&name=value)'
  )
}))

it('should log params of the request of axios instance with special characters', () => axios.create()({
  method: 'GET',
  url: 'http://example.com/',
  params: {
    'parameter name': '&'
  },
  adapter: config => Promise.resolve({
    status: 200,
    statusText: 'BAR',
    config
  })
}).then(() => {
  debug.log.should.be.calledTwice()
  debug.log.firstCall.should.be.calledWithExactly(
    'GET http://example.com/?parameter+name=%26'
  )
  debug.log.secondCall.should.be.calledWithExactly(
    '200 BAR', '(GET http://example.com/?parameter+name=%26)'
  )
}))

it('should add custom debug logger to axios instance', () => {
  const spy = sinon.spy()
  const instance = axios.create({})
  require('.').addLogger(instance, spy)
  return instance({
    url: 'http://example.com/',
    adapter: config => Promise.resolve({
      status: 200,
      statusText: 'OK',
      config
    })
  }).then(() => {
    spy.should.be.calledTwice()
    spy.firstCall.should.be.calledWithExactly(
      'GET http://example.com/'
    )
    spy.secondCall.should.be.calledWithExactly(
      '200 OK', '(GET http://example.com/)'
    )
  })
})

it('should be able to set format of response & response logging', () => {
  const requestLogger = sinon.spy((debug, config) => debug(config.method.toUpperCase()))
  const responseLogger = sinon.spy((debug, response) => debug(response.statusText.toUpperCase()))
  require('.')({
    request: requestLogger,
    response: responseLogger
  })
  return axios({
    method: 'FOO',
    url: 'http://example.com/',
    adapter: config => Promise.resolve({
      status: 200,
      statusText: 'BAR',
      config
    })
  }).then(response => {
    const debugLog = sinon.match({ namespace: 'axios' })
    requestLogger.should.be.calledWith(debugLog, response.config)
    responseLogger.should.be.calledWith(debugLog, response)
    debug.log.should.be.calledTwice()
    debug.log.firstCall.should.be.calledWith('FOO')
    debug.log.secondCall.should.be.calledWith('BAR')
  })
})
