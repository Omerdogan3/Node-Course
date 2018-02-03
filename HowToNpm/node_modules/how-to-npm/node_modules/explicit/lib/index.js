'use strict'

var prepare = require('./prepare')
var applyDefinitions = require('./applyDefinitions')
var assertPlugin = require('./assertPlugin')
var async_plugin = require('../plugin/async')

function explicit (definitions, options, modify) {
  if (modify !== undefined && typeof modify !== 'function') {
    throw new Error('Can not modify explicit definitions with: ' + modify)
  }

  var prepared = prepare(definitions, options, modify)

  return applyDefinitions(
    prepared.definitions,
    prepared.options
  )
}

explicit.async = function explicitAsync (definitions, options) {
  options = assertPlugin(options, async_plugin)

  return explicit(definitions, options, function makeAsync (entry) {
    entry.$async = true
  })
}

module.exports = explicit
