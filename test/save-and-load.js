'use strict'

const chai = require('chai')
const should = chai.should
const expect = chai.expect
const assert = chai.assert

const target = require('../js/service/file-io')

describe('list files', function () {
  it('reads directory without error', function () {
    expect(target.getFilenames('/tmp')).to.be.a('array')
  })

  const list = target.getFilenames('/tmp')
  console.log(list)

  it('throws an error when directory does not exist', function () {
    try {
      target.getFilenames('/nowhere')
    } catch (err) {
      expect(err).to.have.property('code').equal('ENOENT')
    }
  })
})
