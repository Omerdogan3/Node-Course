'use strict'

var validate = require('../../lib/validate')
var clone = Array.prototype.slice
var Joi = require('joi')
var createArgValidator = require('../_util/argValidator')

module.exports = {
  name: 'args',
  validate: validate(Joi.array().default([])),
  attach: function (definition, method) {
    method.$args = definition.$args

    var validator = createArgValidator(method)

    method.applyValid = function (scope, args) {
      return validator.applyArray(scope, args)
    }

    method.valid = function () {
      return method.applyValid(this, clone.apply(arguments))
    }

    method.applyObject = function (scope, object) {
      return validator.applyObject(scope, object)
    }

    method.validObject = function (object) {
      return method.applyObject(this, object)
    }
  }
}
