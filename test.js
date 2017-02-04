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

it('should logging request', () => axios({
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

it('should logging request of axios instance', () => axios.create()({
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
