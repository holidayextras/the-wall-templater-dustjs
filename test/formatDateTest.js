'use strict'

var expect = require('chai').expect

var dustMock
var chunkMock

describe('Format date - Dust helpers', function () {
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

    require('../helpers/formatDate.js')(dustMock)
    done()
  })

  it('should return "2015-01-07" from 2015-01-07', function () {
    var params = {
      date: '01/07/2015', // american date :(
      format: 'YYYY-MM-DD'
    }

    expect(dustMock.helpers._formatDate(chunkMock, null, null, params)).to.be.equal('2015-01-07')
  })

  it('should return "Invalid date" when no params are passed', function () {
    var params = null

    expect(dustMock.helpers._formatDate(chunkMock, null, null, params)).to.be.deep.equal('Invalid date')
  })
})
