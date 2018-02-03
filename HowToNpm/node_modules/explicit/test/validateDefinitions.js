'use strict'

var expect = require('chai').expect
var validateDefinitions = require('../lib/validate/definitions')

function noop () { return undefined }

function validate (before, after) {
  expect(validateDefinitions(before, [])).to.deep.eql(after)
}

function validateAll (entries) {
  entries.forEach(function (tuple) { validate(tuple[0], tuple[1]) })
}

describe('Validation of definitions', function () {
  it('should just pass variables', function (done) {
    validateAll([
      [ 1, {$one: true, _raw: true, _rawContent: 1} ],
      [ true, {$one: true, _raw: true, _rawContent: true} ],
      [ false, {$one: true, _raw: true, _rawContent: false} ],
      [ 'hello', {$one: true, _raw: true, _rawContent: 'hello'} ],
      [ noop, {$one: true, _raw: true, _rawContent: noop} ]
    ])
    validate(null, {$one: true, _raw: true, _rawContent: null})
    validate(undefined, {$one: true, _raw: true, _rawContent: undefined})
    done()
  })

  it('should accept regular entries', function (done) {
    validate({}, {})
    validate({
      $one: true,
      $: noop
    }, {
      $one: true,
      $: noop
    })
    validate({
      a: 1,
      test: noop
    }, {
      a: {$one: true, _raw: true, _rawContent: 1},
      test: { $: noop }
    })
    validate({
      test: { $: noop }
    }, {
      test: { $: noop }
    })
    done()
  })

  it('should break invalid names', function (done) {
    try {
      validateDefinitions({ $one: true, $: 'hi' })
    } catch (e) {
      expect(e.name).to.be.eql('ValidationError')
      return done()
    }
    throw new Error("Shouldn't reach here")
  })

  it('should accept arrays', function (done) {
    validate([], [])
    validate([{
      $: noop
    }], [{
      $: noop
    }])
    done()
  })

  it('should validate plugins', function (done) {
    var result = validateDefinitions({
      test: {
        $test: 1,
        $: noop
      }
    }, [{
      name: 'test',
      validate: function (value) {
        expect(value).to.eql(1)
        return 2
      }
    }])
    expect(result).to.deep.eql({
      test: {
        $test: 2,
        $: noop
      }
    })
    done()
  })

  it('should still validate unused plugins', function (done) {
    var result = validateDefinitions({
      test: {
        $: noop
      }
    }, [{
      name: 'test',
      validate: function (value) {
        expect(value).to.eql(undefined)
        return 2
      }
    }])
    expect(result).to.deep.eql({
      test: {
        $: noop,
        $test: 2
      }
    })
    done()
  })
})
