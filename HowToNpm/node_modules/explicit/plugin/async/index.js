'use strict'

var validate = require('../../lib/validate')
var Joi = require('joi')

module.exports = {
  name: 'async',
  validate: validate(Joi.boolean())
}
