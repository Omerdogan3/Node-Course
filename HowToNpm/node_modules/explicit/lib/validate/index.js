'use strict'

var Joi = require('joi')

module.exports = function (schema) {
  return function (data) {
    var result = Joi.validate(data, schema)
    if (result.error) {
      throw result.error
    }
    return result.value
  }
}
