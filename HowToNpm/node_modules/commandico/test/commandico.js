'use strict'

var commandico = require('..')
var expect = require('chai').expect

describe('standard execution', function () {
  it('simplest execution', function (done) {
    commandico(null, 'menu')
      .addCommands([{
        aliases: ['menu'],
        handler: done
      }])
      .execute(['menu'])
  })

  it('fallback execution', function (done) {
    commandico(null, 'menu')
      .addCommands([{
        aliases: ['menu'],
        handler: done
      }])
      .execute([])
  })

  it('fallback on missing array', function (done) {
    commandico(null, 'menu')
      .addCommands([{
        aliases: ['menu'],
        handler: done
      }])
      .execute()
  })

  it('fallback on null', function (done) {
    commandico(null, 'menu')
      .addCommands([{
        aliases: ['menu'],
        handler: done
      }])
      .execute([null])
  })

  it('fallback on something', function (done) {
    commandico(null, 'menu')
      .addCommands([{
        aliases: ['menu'],
        handler: done
      }])
      .execute(['something'])
  })

  it('non default entries', function (done) {
    commandico(null, 'menu')
      .addCommands([{
        aliases: ['menu'],
        handler: function () {
          return
        }
      }, {
        aliases: ['moxy'],
        handler: done
      }])
      .execute(['moxy'])
  })

  it('non default entries', function (done) {
    commandico(null, 'menu')
      .addCommands([{
        aliases: ['menu'],
        handler: function () {
          return
        }
      }, {
        aliases: ['moxy'],
        handler: done
      }])
      .execute(['moxy'])
  })

  it('modifier execution', function (done) {
    var v = false
    commandico(null, 'menu')
      .addModifiers([{
        aliases: ['v'],
        handler: function () {
          v = true
        }
      }])
      .addCommands([{
        aliases: ['menu'],
        handler: function () {
          expect(v).to.equal(true)
          done()
        }
      }])
      .execute(['menu', '-v'])
  })

  it('missing modifiers', function (done) {
    commandico(null, 'menu')
      .addModifiers([{
        aliases: ['x'],
        handler: function () {
          throw new Error('?')
        }
      }])
      .addCommands([{
        aliases: ['menu'],
        handler: done
      }])
      .execute(['menu', '-v'])
  })

  it('missing default', function (done) {
    try {
      commandico(null, 'menu')
        .execute(['menu', '-v'])
    } catch (e) {
      done()
      return
    }
    throw new Error('No error thrown even though default was missing.')
  })

  it('modifier filter=true execution', function (done) {
    var v = false
    commandico(null, 'menu')
      .addModifiers([{
        aliases: ['v'],
        filter: function () {
          return false
        },
        handler: function () {
          v = true
        }
      }])
      .addCommands([{
        aliases: ['menu'],
        handler: function () {
          expect(v).to.equal(false)
          done()
        }
      }])
      .execute(['menu', '-v'])
  })

  it('modifier filter=false execution', function (done) {
    var v = false
    commandico(null, 'menu')
      .addModifiers([{
        aliases: ['v'],
        filter: function () {
          return true
        },
        handler: function () {
          v = true
        }
      }])
      .addCommands([{
        aliases: ['menu'],
        handler: function () {
          expect(v).to.equal(true)
          done()
        }
      }])
      .execute(['menu', '-v'])
  })

  it('multiple modifiers', function (done) {
    var v = 0
    commandico(null, 'menu')
      .addModifiers([{
        aliases: ['v'],
        handler: function () {
          v += 1
        }
      }, {
        aliases: ['v'],
        handler: function () {
          v += 1
        }
      }])
      .addCommands([{
        aliases: ['menu'],
        handler: function () {
          expect(v).to.equal(2)
          done()
        }
      }])
      .execute(['menu', '-v'])
  })

  it('menu filter', function (done) {
    commandico(null, 'menu')
      .addCommands([{
        aliases: ['menu'],
        handler: done
      }, {
        aliases: ['menu'],
        filter: function () {
          return false
        },
        handler: function () {
          throw new Error('?')
        }
      }])
      .execute(['menu'])
  })

  it('menu filter order test', function (done) {
    commandico(null, 'menu')
      .addCommands([{
        aliases: ['menu'],
        filter: function () {
          return false
        },
        handler: function () {
          throw new Error('?')
        }
      }, {
        aliases: ['menu'],
        handler: done
      }])
      .execute(['menu'])
  })

  it('command order test', function (done) {
    commandico(null, 'menu')
      .addCommands([{
        aliases: ['menu'],
        handler: function () {
          throw new Error('?')
        }
      }, {
        aliases: ['menu'],
        handler: done
      }])
      .execute(['menu'])
  })

  it('multi command order test', function (done) {
    commandico(null, 'menu')
      .addCommands([{
        aliases: ['menu'],
        handler: function () {
          throw new Error('?')
        }
      }])
      .addCommands([{
        aliases: ['menu'],
        handler: done
      }])
      .execute(['menu'])
  })

  it('loadCommands test', function (done) {
    var command = commandico(null, 'menu')
      .loadCommands(__dirname + '/../test_cmds')
      .getCommand('menu')

    expect(command).to.not.equal(null)
    done()
  })

  it('ordinary modifier executuoin', function (done) {
    var scope = {}
    var called = 0
    commandico(scope, 'menu')
      .addModifiers([{
        aliases: ['v', 'version'],
        handler: function (modifierScope, value, alias) {
          expect(modifierScope).to.be.equal(scope)
          expect(value).to.be.equal(2)
          expect(alias).to.be.equal('version')
          called++
        }
      }])
      .addCommands([{
        aliases: ['menu'],
        handler: function () {
          expect(called).to.be.equal(1)
          done()
        }
      }])
      .execute(['menu', '--version=2'])
  })

  it('loadModifiers test', function (done) {
    var modifiers = commandico(null, 'menu')
      .loadModifiers(__dirname + '/../test_modifier')
      .modifiers

    expect(modifiers[0]).to.not.equal(null)
    done()
  })

  it('ordered multi command order test', function (done) {
    commandico(null, 'menu')
      .addCommands([{
        order: 1,
        aliases: ['menu'],
        handler: done
      }, {
        aliases: ['menu'],
        handler: function () {
          throw new Error('?')
        }
      }])
      .execute(['menu'])
  })

  it('add various orders', function (done) {
    commandico(null, 'menu')
      .addCommands([{
        order: 2,
        aliases: ['menu'],
        handler: done
      }, {
        order: 1,
        aliases: ['menu'],
        handler: function () {
          throw new Error('?')
        }
      }])
      .execute(['menu'])
  })

  it('add various orders', function (done) {
    commandico(null, 'menu')
      .addCommands([{
        aliases: ['menu'],
        handler: function () {
          throw new Error('?')
        }
      }, {
        order: 1,
        aliases: ['menu'],
        handler: done
      }])
      .execute(['menu'])
  })
})
