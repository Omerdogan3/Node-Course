'use strict'

var util = require('util')

function applyDefinition (options) {
  return function (definition) {
    if (definition._raw) {
      return definition._rawContent
    }
    var method = definition.$
    var wraps
    options.plugins.forEach(function (plugin) {
      var field = '$' + plugin.name
      var newMethod
      if (definition[field] !== undefined && plugin.augment) {
        newMethod = plugin.augment(definition, method)
        if (typeof newMethod !== 'function') {
          throw new Error("Augmentation: The plugin '" + plugin.name + "' does not return a method.")
        }
        if (newMethod !== method) {
          if (!wraps) {
            wraps = []
          }
          wraps.unshift(method)
          method = newMethod
        }
      }
    })
    method.$wraps = wraps
    options.plugins.forEach(function (plugin) {
      var field = '$' + plugin.name
      if (definition[field] !== undefined) {
        method[field] = definition[field]
        if (plugin.attach) {
          plugin.attach(definition, method)
        }
      }
    })
    return method
  }
}

function applyDefinitionMap (definitions, localAD) {
  var result = {}
  Object.keys(definitions).forEach(function (name) {
    result[name] = localAD(definitions[name])
  })
  return result
}

function applyDefinitions (definitions, options) {
  var localAD = applyDefinition(options)

  if (util.isArray(definitions)) {
    return definitions.map(localAD)
  }

  if (definitions.$one) {
    return localAD(definitions)
  }

  return applyDefinitionMap(definitions, localAD)
}

module.exports = applyDefinitions
