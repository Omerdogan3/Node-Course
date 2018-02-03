'use strict'

var util = require('util')

function PluginMap (plugins) {
  if (plugins === undefined) {
    plugins = []
  } else if (!util.isArray(plugins)) {
    plugins = [plugins]
  }

  var map = {}
  plugins.forEach(function (plugin) {
    map[plugin.name] = plugin
  })

  this.plugins = plugins
  this.pluginMap = map
}

util.inherits(PluginMap, Array)

PluginMap.prototype.forEach = function (method) {
  return this.plugins.forEach(method)
}

module.exports = PluginMap
