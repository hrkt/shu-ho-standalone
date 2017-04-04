'use strict'

import fs from 'fs'
import chai from 'chai'
// const should = chai.should
const expect = chai.expect

import generator from '../src/js/template-generator'

describe('generateTemplate', function () {
  it('generates without error', function () {
    expect(generator.generateTemplate()).to.be.a('string')
  })
})

