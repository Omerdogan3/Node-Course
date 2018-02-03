'use strict'

var validate = require('../../lib/validate')
var clone = Array.prototype.slice
var Joi = require('joi')
var createArgValidator = require('../_util/argValidator')

module.exports = {
  name: 'assert',
  validate: validate(Joi.boolean().default(false)),
  augment: function (definition, method) {
    if (!definition.$assert) {
      return method
    }
    method.$args = definition.$args

    var validator = createArgValidator(method)

    return function () {
      return validator.applyArray(this, clone.apply(arguments))
    }
  }
}
