# workshopper-adventure-storage

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url]
[![NPM deps][deps-image]][deps-url] [![NPM dev devp][dev-deps-image]][dev-deps-url]

Simple storage for [workshopper-adventure](https://github.com/workshopper/workshopper-adventure)

Originally included as part of workshopper-adventure, mostly written by [Martin Heidegger](https://github.com/martinheidegger)

Based on prior work of:
[@substack](https://github.com/substack)
[@rvagg](https://github.com/rvagg)

## Install

```
npm install workshopper-adventure-storage --save
```

```js
const storage = require('workshopper-adventure-storage')
```

## Properties

## storage.dir
The path to store data in.

## storage.userDir
A default path to store data in.

## Methods
```js
const storage = require('workshopper-adventure-storage')
```

## storage([dir[, ...]])
Accepts a sequence of paths for `path.resolve` to use as the storage directory.

## storage.save('name', data)

JSON encodes and writes a file to the storage directory. The following will
save the file as `index.json`.

```js
const data = {
  foo: 'bar'
}
storage.save('index', data)
```

## storage.get('name')
Retrieves and unserializes a file from storage.

```js
var data = storage.get('index')
```

## storage.reset()
Clears the storage directory.

```js
storage.reset()
```

[downloads-image]: http://img.shields.io/npm/dm/workshopper-adventure-storage.svg
[npm-url]: https://npmjs.org/package/workshopper-adventure-storage
[npm-image]: http://img.shields.io/npm/v/workshopper-adventure-storage.svg

[deps-url]:https://david-dm.org/workshopper/workshopper-adventure-storage
[deps-image]: https://img.shields.io/david/workshopper/workshopper-adventure-storage.svg

[dev-deps-url]: https://david-dm.org/workshopper/workshopper-adventure-storage?type=dev
[dev-deps-image]: https://img.shields.io/david/dev/workshopper/workshopper-adventure-storage.svg

[travis-url]: https://travis-ci.org/workshopper/workshopper-adventure-storage
[travis-image]: https://travis-ci.org/workshopper/workshopper-adventure-storage.png?branch=master
[coveralls-url]: https://coveralls.io/github/workshopper/workshopper-adventure-storage?branch=master
[coveralls-image]: https://coveralls.io/repos/github/workshopper/workshopper-adventure-storage/badge.svg?branch=master
