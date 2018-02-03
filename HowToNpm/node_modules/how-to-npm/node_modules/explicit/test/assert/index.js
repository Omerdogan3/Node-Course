'use strict'

var joi = require('joi')
var explicit = require('../../')

function noop () {
  return Array.prototype.slice.apply(arguments)
}

describe('Making sure validation works', function () {
  it('should use the new argument from the proper position', function (done) {
    var method = explicit({
      $one: true,
      $args: [joi.number()],
      $assert: true,
      $: noop
    })
    try {
      method('a')
    } catch (e) {
      done()
      return
    }
    throw new Error('There should have been an error')
  })
})
