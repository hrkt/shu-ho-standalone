'use strict'

const chai = require('chai')
const should = chai.should
const expect = chai.expect
const assert = chai.assert

const target = require('../js/service/file-io')

describe('list files', function () {
  const list = target.getFilenames('.')
  console.log(list)

  it('reads directory without error', function () {
    expect(target.getFilenames('.')).to.be.a('array')
  })

  it('returns at least 3 filenames', function () {
    expect(target.getFilenames('.')).to.have.length.of.at.least(3)
  })

  it('throws an error when directory does not exist', function () {
    try {
      target.getFilenames('/nowhere')
    } catch (err) {
      expect(err).to.have.property('code').equal('ENOENT')
    }
  })
})
