'use strict'

var explicit = require('explicit')
var joi = require('joi')

var command = joi.object({
  order: joi.number().integer().default(0).optional(),
  handler: joi.func().required(),
  filter: joi.func().optional(),
  aliases: joi.array().min(1).items(joi.string())
}).unknown()

var commands = joi.array().items(command)

var itemFilter = function itemFilter (scope, item) {
  return typeof item.filter === 'function' ? item.filter(scope) : true
}

var loadFromFolder = function loadFromFolder (folder) {
  var path = require('path')
  var fs = require('fs')
  return fs.readdirSync(folder).filter(function (file) {
    return path.extname(file) === '.js'
  }).map(function (file) {
    var name = file.substr(0, file.length - '.js'.length)
    var cmd = require(path.join(folder, name))
    if (!cmd.aliases) {
      cmd.aliases = []
    }
    cmd.aliases.unshift(name)
    return cmd
  })
}
var orderSort = function orderSort (a, b) {
  var orderA = a.order || 0
  var orderB = b.order || 0

  if (orderA > orderB) {
    return 1
  }
  if (orderA < orderB) {
    return -1
  }
  return 0
}

var Commandico = explicit({
  $one: true,
  $args: [
    joi.any().meta('scope'),
    joi.string().meta('default').required()
  ],
  $: function (scope, defaultCommand) {
    if (!(this instanceof Commandico)) {
      return new Commandico(scope, defaultCommand)
    }
    this.scope = scope
    this.defaultCommand = defaultCommand
    this.commands = []
    this.modifiers = []
  }
}).valid

Commandico.prototype = explicit({
  loadCommands: {
    $args: [joi.string().meta('folder').required()],
    $assert: true,
    $: function (folder) {
      return this.addCommands(loadFromFolder(folder))
    }
  },
  addCommands: {
    $args: [commands.meta('commands')],
    $assert: true,
    $: function (commands) {
      commands.forEach(function (command) {
        this.commands.push(command)
      }.bind(this))
      return this
    }
  },
  loadModifiers: {
    $args: [joi.string().meta('folder').required()],
    $assert: true,
    $: function (folder) {
      return this.addModifiers(loadFromFolder(folder))
    }
  },
  addModifiers: {
    $args: [commands.meta('modifiers')],
    $assert: true,
    $: function (modifiers) {
      modifiers.forEach(function (modifier) {
        this.modifiers.unshift(modifier)
      }.bind(this))
      return this
    }
  },
  getCommand: {
    $args: [joi.string().meta('name').allow(null).optional()],
    $assert: true,
    $: function (name) {
      if (name === null || name === undefined) {
        return null
      }
      var commands = this.commands.sort(orderSort)
      for (var i = commands.length - 1; i >= 0; i--) {
        var command = commands[i]
        if (!itemFilter(this.scope, command)) {
          continue
        }
        if (command.aliases.indexOf(name) !== -1) {
          return command
        }
      }
      return null
    }
  },
  execute: {
    $args: [joi.array().meta('args').default([]).optional()],
    $assert: true,
    $: function (args) {
      var mode = args[0]
      var argv = require('minimist')(args)
      var command = this.getCommand(mode) || this.getCommand(this.defaultCommand)
      this.modifiers
        .filter(itemFilter.bind(null, this.scope))
        .sort(orderSort)
        .forEach(function (item) {
          for (var i = 0; i < item.aliases.length; ++i) {
            var alias = item.aliases[i]
            var value = argv[alias]
            if (value !== undefined && value !== null) {
              item.handler(this.scope, value, alias)
            }
          }
        }.bind(this))

      if (!command) {
        throw new Error('default command not found')
      }

      command.handler(this.scope, argv._.slice(1))
    }
  }
})

module.exports = Commandico
