'use strict'

var util = require('util')
var validateDefinition = require('./definition')

function validateMap (definitions, localVD) {
  var result = {}
  Object.keys(definitions).forEach(function (name) {
    var entry = definitions[name]
    if (typeof entry === 'function') {
      entry = {
        $: entry
      }
    }
    result[name] = localVD(entry)
  })
  return result
}

function validateDefinitions (definitions, pluginMap) {
  var localVD = validateDefinition(pluginMap)

  if (util.isArray(definitions)) {
    return definitions.map(localVD)
  }

  if (typeof definitions === 'object' && definitions !== null && definitions !== undefined) {
    if (definitions.$one) {
      return localVD(definitions)
    }
    return validateMap(definitions, localVD)
  }

  return localVD(definitions)
}

module.exports = validateDefinitions
