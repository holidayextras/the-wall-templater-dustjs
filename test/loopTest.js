'use strict'

var expect = require('chai').expect

var dustMock
var chunkMock
var bodies
var context

describe('Loop - Dust helpers', function () {
  before(function (done) {
    var returnEasy = function (value) {
      return value
    }
    dustMock = {
      helpers: {
        tap: function (valueToSearch) {
          return valueToSearch || null
        }
      }
    }
    chunkMock = {
      write: returnEasy,
      render: function (bodiesFunction, value) {
        // We don't care about bodiesFunction, we just want to see what the value would be
        return value
      }
    }
    bodies = {
      block: returnEasy
    }
    context = {
      push: returnEasy
    }

    require('../helpers/loop.js')(dustMock)
    done()
  })

  it('should loop upwards', function () {
    var params = {
      from: 0,
      to: 2
    }

    expect(dustMock.helpers._loop(chunkMock, context, bodies, params)).to.equal(2)
  })

  it('should loop downwards', function () {
    var params = {
      from: 2,
      to: 0
    }

    expect(dustMock.helpers._loop(chunkMock, context, bodies, params)).to.equal(0)
  })

  it('should loop downwards and convert strings to numbers', function () {
    var params = {
      from: '2',
      to: '0'
    }

    expect(dustMock.helpers._loop(chunkMock, context, bodies, params)).to.equal(0)
  })
})
