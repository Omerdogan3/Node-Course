var storage = require('..')
var fs = require('fs')
var expect = require('chai').expect
var rimraf = require('rimraf')
var path = require('path')
var mkdirp = require('mkdirp')

describe('Storage', function () {
  var userDir = path.join(__dirname, '..', '.tmp')
  var route = [userDir, 'foo', 'bar']
  var storageDir = path.join.apply(path, route)
  var fileNameA = path.join(storageDir, 'a.json')
  var fileNameB = path.join(storageDir, 'b.json')

  function assertStorageNonExistence () {
    try {
      if (fs.accessSync) {
        fs.accessSync(storageDir)
      } else {
        fs.statSync(storageDir)
      }
    } catch (e) {
      expect(e.code).to.be.equals('ENOENT')
      return
    }
    throw new Error('storage folder seems to exist?!')
  }

  function create () {
    return storage.apply(null, route)
  }

  before(function () {
    // For the test to run in an restricted environment that
    // also doesn't interfere we run in a clear, separate user
    // directory
    rimraf.sync(userDir)
    storage.userDir = userDir
  })

  describe('in clean state', function () {
    beforeEach(function () {
      rimraf.sync(userDir)
    })

    it('should not automatically create a folder', function () {
      // If the storage creates a folder automatically we might
      // theoretically end up with a lot of empty foldes, it
      // is better that the storages are only created once they
      // exist
      create()
      assertStorageNonExistence()
    })

    it('should not create a folder when getting data', function () {
      // It might be tempting to make a system to create a file
      // if a property is missing. This would be unwanted behavior
      // (for the same reason as one above)
      create().get('a')
      assertStorageNonExistence()
    })

    it('should allow to get data', function () {
      // By allowing this we can simply assume & test for null
      expect(create().get('a')).to.be.equals(null)
    })

    it('should store files at a predicatable locations', function () {
      // In order to be update compatible the path should be
      // in this and future versions of the storage api
      var storage = create()
      storage.save('a', 1)
      storage.save('b', 2)
      expect(JSON.parse(fs.readFileSync(fileNameA))).to.be.equals(1)
      expect(JSON.parse(fs.readFileSync(fileNameB))).to.be.equals(2)
    })

    it('should store readable files', function () {
      // For debugging we want the files to be stored
      // in a fashion that is readable to humans
      create().save('a', {x: 1})
      expect(fs.readFileSync(fileNameA, 'utf8')).to.be.equals('{\n  "x": 1\n}')
    })

    it('should allow to store data', function () {
      var storage = create()
      storage.save('a', 1)
      expect(storage.get('a')).to.be.equals(1)
    })

    it('should allow to reset the store', function () {
      // Reset as operation could happen at any given
      // time, this can break if reset assumes that
      // the folder exists
      var storage = create()
      storage.reset()
      expect(storage.get('a')).to.be.equals(null)
    })
  })

  describe('with stored data', function () {
    var storage = create()
    beforeEach(function () {
      rimraf.sync(userDir)
      storage.save('a', 1)
    })

    it('should return the stored data', function () {
      expect(storage.get('a')).to.be.equals(1)
    })

    it('should allow to overwrite the data', function () {
      storage.save('a', 2)
      expect(storage.get('a')).to.be.equals(2)
    })

    it('should allow to reset the data', function () {
      storage.reset()
      expect(storage.get('a')).to.be.equals(null)
    })
  })

  describe('with corrupt storage', function () {
    var storage = create()
    beforeEach(function () {
      rimraf.sync(userDir)
      mkdirp.sync(storageDir)
      fs.writeFileSync(fileNameA, '{')
    })

    it('should still not break get', function () {
      // By breaking the API with a broken file we gain no
      // value for the user of workshoppers. A broken file
      // should not inflict pain on the user of
      // workshopper-adventure
      //
      // TODO: Debugging broken files could be improved by storing the broken
      //       file in a backup location
      expect(storage.get('a')).to.be.equal(null)
    })

    it('should allow to overwrite the broken data', function () {
      storage.save('a', 1)
      expect(storage.get('a')).to.be.equal(1)
    })

    it('should allow to reset the state', function () {
      storage.reset()
      expect(storage.get('a')).to.be.equal(null)
    })
  })

  describe('inaccessible storage', function () {
    var storage = create()
    before(function () {
      rimraf.sync(userDir)
      mkdirp.sync(storageDir)
      fs.writeFileSync(fileNameA, '{"x": 1}')
      fs.chmodSync(fileNameA, 0)
      fs.chmodSync(storageDir, 0)
    })

    it('should still not break get', function () {
      expect(storage.get('a')).to.be.equal(null)
    })

    it('should just not store if a file isn\'t writable', function () {
      storage.save('a', 1)
      expect(storage.get('a')).to.be.equal(null)
    })

    after(function () {
      fs.chmodSync(storageDir, 448)
      fs.chmodSync(fileNameA, 448)
      rimraf.sync(userDir)
    })
  })
})
