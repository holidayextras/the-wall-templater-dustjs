'use strict'

var expect = require('chai').expect

var dustMock
var chunkMock

describe('Format number - Dust helpers', function () {
  before(function (done) {
    dustMock = {
      helpers: {
        tap: function (valueToSearch) {
          return valueToSearch || null
        }
      }
    }

    chunkMock = {
      write: function (value) {
        return value
      }
    }

    require('../helpers/formatNumber.js')(dustMock)
    done()
  })

  it('should return "1,000.00" from 1000', function () {
    var params = {
      number: 1000,
      format: '[0,000].00'
    }

    expect(dustMock.helpers._formatNumber(chunkMock, null, null, params)).to.equal('1,000.00')
  })

  it('should return "0" when no params are passed', function () {
    var params = null

    expect(dustMock.helpers._formatNumber(chunkMock, null, null, params)).to.equal('0')
  })
})
