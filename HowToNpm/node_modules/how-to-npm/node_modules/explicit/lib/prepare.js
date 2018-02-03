'use strict'

var validateDefinitions = require('./validate/definitions')
var validateOptions = require('./validate/options')
var assertPlugin = require('./assertPlugin')
var PluginMap = require('./PluginMap')
var args_plugin = require('../plugin/args')
var assert_plugin = require('../plugin/assert')
var util = require('util')

function prepareDefinitions (definitions, options, modify) {
  if (modify) {
    if (util.isArray(definitions)) {
      definitions.forEach(modify)
    } else if (definitions.$one) {
      modify(definitions)
    } else {
      Object.keys(definitions).forEach(function (key) {
        modify(definitions[key])
      })
    }
  }
  definitions = validateDefinitions(definitions, options.plugins)
  return definitions
}

function prepareOptions (options) {
  options = assertPlugin(options, args_plugin)
  options = assertPlugin(options, assert_plugin)
  options = validateOptions(options)
  options.plugins = new PluginMap(options.plugins)
  return options
}

module.exports = function (definitions, options, modify) {
  options = prepareOptions(options)
  return {
    definitions: prepareDefinitions(definitions, options, modify),
    options: options
  }
}
