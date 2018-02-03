'use strict'

var Joi = require('joi')
var PluginNoName = Joi.object({
  validate: Joi.func().required(),
  augment: Joi.func(),
  attach: Joi.func()
})
var Plugin = PluginNoName.keys({
  name: Joi.string().required()
})

module.exports = Joi.object({
  plugins: Joi.alternatives().try(
  Joi.array().items(Plugin, Joi.string()),
  Plugin
  ).default([])
}).strict()
