[![build status](https://travis-ci.org/explicitjs/explicit.svg?branch=master)](https://travis-ci.org/explicitjs/explicit)
[![Code Climate](https://codeclimate.com/github/explicitjs/explicit/badges/gpa.svg)](https://codeclimate.com/github/explicitjs/explicit)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

# Explicit.js

Explicit.js allows explicitl annotation, documentation and augmentation of JavaScript methods.

```bash
npm i explicit joi -S
```

## Usage

```JavaScript
var explicit = require("explicit"),
    joi = require("joi");

var object = explicit({
    foo: {
        $args: [
            joi.string().meta("bar")
        ],
        $: function (bar) {
            console.info(bar);
        }
    }
});

object.foo(1); // 1
object.foo.valid(1); // will fail because the first argument is not allowed to be a string
object.foo.validObject({
    bar: "Hello World"
}); // "Hello World"
```

For single method definition add the  ```$one``` parameter.

```JavaScript
var foo = explicit({
    $one: true,   
    $args: [
        joi.string().meta("bar")
    ],
    $: function (bar) {
        console.info(bar);
    }
});

foo(1); // 1
foo.valid(1); // will fail because the first argument has to be a string
foo.validObject({
    bar: "Hello World"
}); // "Hello World"
```

And in case you want to make the assertion required you add the ```$assert``` parameter.

```JavaScript
var foo = explicit({
    $one: true,
    $assert: true, 
    $args: [
        joi.string().meta("bar")
    ],
    $: function (bar) {
        console.info(bar);
    }
});
foo(1); // will fail because the first argument has to be a string
```