'use strict'

var validate = require('./index')(require('../schema/definition'))

module.exports = function (pluginMap) {
  return function (definition) {
    if (typeof definition !== 'object' || definition === null || definition === undefined) {
      return {
        $one: true,
        _raw: true,
        _rawContent: definition
      }
    }
    definition = validate(definition)
    pluginMap.forEach(function (plugin) {
      var field = '$' + plugin.name
      definition[field] = plugin.validate(definition[field])
    })
    return definition
  }
}
