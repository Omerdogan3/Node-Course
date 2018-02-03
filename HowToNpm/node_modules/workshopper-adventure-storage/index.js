var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var rimraf = require('rimraf')

function createSimpleStorage () {
  var dir = path.join.apply(path, arguments)

  function fileName (name) {
    return path.resolve(dir, name + '.json')
  }

  /**
   * Delete the storage directory.
   */
  function reset () {
    rimraf.sync(dir)
  }

  /**
   * Serialize and save a file to the storage directory.
   */
  function save (name, data) {
    mkdirp.sync(dir)
    try {
      fs.writeFileSync(fileName(name), JSON.stringify(data, null, 2))
    } catch (e) {
      // TODO: write this error in a log
    }
  }

  /**
   * Read and unserialize a file from the storage directory.
   */
  function get (name) {
    var file = fileName(name)
    try {
      var fileData = fs.readFileSync(file, 'utf8')
    } catch (e) {
      // TODO: write this error in a log
      return null
    }
    try {
      return JSON.parse(fileData)
    } catch (e) {
      // TODO: write this error in a log
      return null
    }
  }

  return {
    dir: dir,
    reset: reset,
    save: save,
    get: get
  }
}

createSimpleStorage.userDir = process.env.HOME || process.env.USERPROFILE

module.exports = createSimpleStorage
