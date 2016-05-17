'use strict';

var expect = require('chai').expect;

var dustMock;
var chunkMock;

describe('Differential date - Dust helpers', function() {

  before(function(done) {
    dustMock = {
      helpers: {
        tap: function(valueToSearch) {
          return valueToSearch || null;
        }
      }
    };

    chunkMock = {
      write: function(value) {
        return value;
      }
    };

    require('../helpers/differentialDate.js')(dustMock);
    done();
  });

  it('should return "3" (days) betwen "2015-01-07" and "2015-01-10" and type of "days"', function() {
    var params = {
      startDate: '01/07/2015', // american date :(
      endDate: '01/10/2015', // american date :(
      type: 'days'
    };

    expect(dustMock.helpers._differentialDate(chunkMock, null, null, params)).to.be.equal(3);
  });

  it('should return "4" (days) betwen "2015-01-08" and "2015-01-12" and no type', function() {
    var params = {
      startDate: '01/08/2015', // american date :(
      endDate: '01/12/2015' // american date :(
    };

    expect(dustMock.helpers._differentialDate(chunkMock, null, null, params)).to.be.equal(4);
  });

  it('should return "NaN" when no params are passed', function() {
    var params = null;

    expect(dustMock.helpers._differentialDate(chunkMock, null, null, params)).to.deep.equal(NaN);
  });

});
