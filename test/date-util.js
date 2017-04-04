'use strict'

import fs from 'fs'
import chai from 'chai'
// const should = chai.should
const expect = chai.expect

import * as dateUtil from '../src/js/date-util.js'

describe('getTimestamp', function () {
  it('can get timestamp', function () {
    console.log(dateUtil.getTimestamp())
    expect(dateUtil.getTimestamp()).to.be.a('string')
  })
})
