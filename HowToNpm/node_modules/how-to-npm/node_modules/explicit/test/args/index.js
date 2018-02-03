'use strict'

var expect = require('chai').expect
var joi = require('joi')
var explicit = require('../..')
var validate = require('../../lib/validate')

function firstKey (object) {
  var key
  for (key in object) {
    if (object.hasOwnProperty(key)) {
      return {
        key: key,
        value: object[key]
      }
    }
  }
}

function makeArray (argList) {
  return argList.map(function (arg) {
    return firstKey(arg).value
  })
}

function makeObject (argList) {
  var result = {}
  argList.forEach(function (arg) {
    arg = firstKey(arg)
    result[arg.key] = arg.value
  })
  return result
}

var matrix = {
  named: {
    'named': {
      one: function (name, schema) {
        return schema.meta(name)
      },
      many: function () {
        return Array.prototype.slice.apply(arguments)
      }
    },
    'not-named': {
      one: function (name, schema) {
        return schema
      },
      many: function () {
        var args = Array.prototype.slice.apply(arguments)
        var numberKeys = []
        args.forEach(function (entry, no) {
          Object.keys(entry).every(function (key) {
            var newVal = {}
            newVal[no] = entry[key]
            numberKeys.push(newVal)
            return true
          })
        })
        return numberKeys
      }
    }
  },
  exec: {
    applyObject: function (method, argList) {
      return method.applyObject(null, makeObject(argList))
    },
    applyValid: function (method, argList) {
      return method.applyValid(null, makeArray(argList))
    },
    valid: function (method, argList) {
      return method.valid.apply(null, makeArray(argList))
    },
    validObject: function (method, argList) {
      return method.validObject(makeObject(argList))
    }
  }
}

function noop () {
  return Array.prototype.slice.apply(arguments)
}

function augment (op) {
  return explicit({$one: true, $args: Array.prototype.slice.apply(arguments, [1]), $: op})
}

function expectInvalid (exec, method, args, done, error) {
  if (!error) {
    error = 'ValidationError'
  }
  try {
    exec(method, args)
  } catch (e) {
    expect(e.name).to.be.equal(error)
    return done()
  }
  throw new Error('Expected exception not thrown.')
}

describe('Validating arguments after they have been extended by another plugin', function () {
  it('should use the new argument from the proper position', function (done) {
    var method = explicit({
      $one: true,
      $args: [joi.number()],
      $test: true,
      $: noop
    }, {
      plugins: {
        name: 'test',
        validate: validate(joi.boolean()),
        attach: function (definition, method) {
          method.$args.unshift(joi.string())
        }
      }
    })

    method.valid('a', 1)
    done()
  })
})

describe('Validating an array', function () {
  it("should fail if the argument isn't an array - doh", function (done) {
    var method = explicit({
      $one: true,
      $args: [],
      $: noop
    })

    expectInvalid(function (method, arg) {
      method.applyValid(null, arg)
    }, method, 'a', done, 'Error')
  })
})

function addMatrix (title, meta, exec) {
  var isObject = exec === matrix.exec.validObject || exec === matrix.exec.applyObject
  var isNamed = meta === matrix.named.named

  describe('Validating ' + title + ' arguments', function () {
    if (!(isObject && !isNamed)) {
      it('should pass the arguments', function (done) {
        var method = augment(noop, meta.one('a', joi.any()))

        expect(exec(method, meta.many({a: 'foo'}))).to.deep.eql(['foo'])
        done()
      })
    }

    it('should validate the arguments', function (done) {
      var method = augment(noop, meta.one('a', joi.number()))

      expectInvalid(exec, method, meta.many({a: 'ho'}), done)
    })

    it('should validate the arguments also the second time', function (done) {
      var method = augment(noop, meta.one('a', joi.number()))

      expectInvalid(exec, method, meta.many({a: 'ho'}), function () {
        exec(method, [])
        done()
      })
    })

    it('should not require a not-required argument', function (done) {
      var method = augment(noop, meta.one('a', joi.any()))

      exec(method, [])
      done()
    })

    it('should require a required argument', function (done) {
      var method = augment(noop, meta.one('a', joi.any()).required())

      expectInvalid(exec, method, [], done)
    })

    if (!isObject) {
      it('should allow additional arguments', function (done) {
        var method = augment(noop, meta.one('a', joi.any()))

        expect(exec(method, meta.many({a: 1}, {'1': 2}))).to.be.deep.equal([1, 2])
        done()
      })
    }
    if (isObject && isNamed) {
      it('should allow unknown arguments', function (done) {
        var method = augment(noop, meta.one('a', joi.any()))

        expect(exec(method, meta.many({a: 1}, {b: 2}))).to.be.deep.equal([1])
        done()
      })
    }
  })
}

function setupTestMatrix () {
  Object.keys(matrix.named).forEach(function (nKey) {
    Object.keys(matrix.exec).forEach(function (eKey) {
      addMatrix(nKey + " arguments with '." + eKey + "'", matrix.named[nKey], matrix.exec[eKey])
    })
  })
}

setupTestMatrix()
