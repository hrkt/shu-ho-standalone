'use strict'

import fs from 'fs'
import chai from 'chai'
const should = chai.should
const expect = chai.expect
import rimraf from 'rimraf'

import fileIo from '../src/js/file-io.js'

describe('list files', function () {
  const list = fileIo.getFilenames('.')
  console.log(list)

  it('reads directory without error', function () {
    expect(fileIo.getFilenames('.')).to.be.a('array')
  })

  it('returns at least 3 filenames', function () {
    expect(fileIo.getFilenames('.')).to.have.length.of.at.least(3)
  })

  it('throws an error when directory does not exist', function () {
    try {
      fileIo.getFilenames('/nowhere')
    } catch (err) {
      expect(err).to.have.property('code').equal('ENOENT')
    }
  })
})

describe('prepare data dir', function () {
  const testDirName = 'testdir'
  it('create data dir without error', function () {
    try {
      fileIo.prepareDirIfNotExist(testDirName)
    } catch (err) {
      console.error(err)
      expect.fail(err)
    }
  })

 after(function (done) {
    rimraf.sync(testDirName)
    done()
  })
})

describe('save and load file', function () {
  const path = 'test.txt'

  it('save file without error', function () {
    fileIo.saveWithBase64(path, 'aaa')
  })

  it('load file without error', function () {
    const buf = fileIo.load(path)
    expect(buf).to.be.a('string')

    expect(buf).to.contain('aaa')
  })

  after(function (done) {
    fs.unlinkSync('test.txt')
    done()
  })
})
