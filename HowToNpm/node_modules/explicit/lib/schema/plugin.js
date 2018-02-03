'use strict'

var Joi = require('joi')

module.exports = Joi.object({
  name: Joi.string().required(),
  validate: Joi.func().required(),
  augment: Joi.func()
}).strict()
