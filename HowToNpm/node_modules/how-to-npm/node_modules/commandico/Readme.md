# Commandico

[![Build Status](https://travis-ci.org/martinheidegger/commandico.svg?branch=master)](https://travis-ci.org/martinheidegger/commandico)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

A tiny - nodejs - command line tool that allows to cleanly create a command-line client. 

# Usage

add `commandico` to your package.json:

```
npm i commandico --save
```

then instantiate commadico:

```JavaScript
var commandico = require('commandico')
  , defaultCommand = 'help'
  , scope = {
    number: 2
  };

var app = commandico(scope, defaultCommand)
```

then give it some commands

```JavaScript
app.addCommands([{
    aliases: ['help'],
    handler: function (scope) {
        console.log(scope.number);
    }
}])
```

And further execute the script with some arguments

```JavaScript
app.execute(['hello world'])
```
