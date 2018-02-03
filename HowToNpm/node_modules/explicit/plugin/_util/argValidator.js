'use strict'

var Joi = require('joi')
var util = require('util')

module.exports = function createArgValidator (method) {
  var firstCall = true
  var $argsLength
  var $argNames
  var testSchema
  var helperObject = {}

  function initCall () {
    firstCall = false
    $argsLength = method.$args.length
    testSchema = {}
    $argNames = []

    method.$args.forEach(function ($arg, no) {
      $arg = Joi.compile($arg)
      var name = $arg.describe().meta || no
      testSchema[name] = $arg
      $argNames.push(name)
    })

    testSchema = Joi.object().keys(testSchema).unknown()
  }

  function applyObject (scope, object, args) {
    var i
    var res

    if (firstCall) {
      initCall()
    }

    if (!args) {
      args = []
    }

    res = Joi.validate(object, testSchema)

    if (res.error) {
      throw res.error
    }

    res = res.value

    for (i = 0; i < $argsLength; i += 1) {
      args[i] = res[$argNames[i]]
    }
    return method.apply(scope, args)
  }

  function applyArray (scope, args) {
    if (firstCall) {
      initCall()
    }

    if (!util.isArray(args)) {
      throw new Error('Trying to apply non-array with applyValid: ' + args)
    }

    for (var i = 0; i < $argsLength; i += 1) {
      helperObject[$argNames[i]] = args[i]
    }

    return applyObject(scope, helperObject, args)
  }

  return {
    applyObject: applyObject,
    applyArray: applyArray
  }
}
