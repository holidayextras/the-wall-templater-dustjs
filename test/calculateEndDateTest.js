'use strict';

var expect = require('chai').expect;

var dustMock;
var chunkMock;

describe('Calculate end date - Dust helpers', function() {

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

    require('../helpers/calculateEndDate.js')(dustMock);
    done();
  });

  it('should return string of "2015-10-10" from "2015-10-07" and 3 nights with type days', function() {
    var params = {
      startDate: '2015-10-07',
      nights: 3,
      type: 'days',
      format: 'DD/MM/YYYY'
    };

    return expect(dustMock.helpers._calculateEndDate(chunkMock, null, null, params)).to.be.a('string').that.equals('10/10/2015');
  });

  it('should return "NaN" when no params are passed', function() {
    var params = null;

    return expect(dustMock.helpers._calculateEndDate(chunkMock, null, null, params)).to.be.deep.equal(NaN);
  });
  it('should return error, "negative numbers are not allowed" when negative night amount is passed', function() {
    var params = {
      startDate: '2015-10-07',
      nights: -3,
      type: 'days'
    };

    return expect(dustMock.helpers._calculateEndDate(chunkMock, null, null, params)).to.be.a('string').that.equals('Negative numbers are not allowed.');
  });

});
