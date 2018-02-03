'use strict'

var expect = require('chai').expect
var explicit = require('../..')

function noop () {
  return undefined
}

describe('Async definitions', function () {
  it('should be marked async', function (done) {
    expect(explicit.async({
      $one: true,
      $: noop
    }).$async).to.equal(true)
    done()
  })
})
