import test from 'ava'

const proxyquire = require('proxyquire')
const sinon = require('sinon')

const spy = sinon.spy()
proxyquire('.', { debug: name => ({ axios: spy }[name]) })

const axios = require('axios')

test('Logging request', t => axios({
  method: 'FOO',
  url: 'http://example.com/',
  headers: { type: 'request' },
  adapter: () => Promise.resolve({
    status: 200,
    statusText: 'BAR',
    headers: { type: 'response' }
  })
}).then(() => {
  t.is(spy.callCount, 2)
  const requestLogging = spy.firstCall
  t.is(requestLogging.args[0], 'FOO http://example.com/')
  t.is(requestLogging.args[1].type, 'request')
  const responseLogging = spy.secondCall
  t.is(responseLogging.args[0], '200 BAR')
  t.is(responseLogging.args[1].type, 'response')
}))
