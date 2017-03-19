'use strict'

import chai from 'chai'
const should = chai.should
const expect = chai.expect

import fileio from '../js/service/file-io'

describe('list files', function () {
  const list = fileio.getFilenames('.')
  console.log(list)

  it('reads directory without error', function () {
    expect(fileio.getFilenames('.')).to.be.a('array')
  })

  it('returns at least 3 filenames', function () {
    expect(fileio.getFilenames('.')).to.have.length.of.at.least(3)
  })

  it('throws an error when directory does not exist', function () {
    try {
      fileio.getFilenames('/nowhere')
    } catch (err) {
      expect(err).to.have.property('code').equal('ENOENT')
    }
  })
})
