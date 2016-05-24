'use strict';

var expect = require('chai').expect;

var dustMock;
var chunkMock;

describe('Format date - Dust helpers', function() {

  before(function(done) {
    dustMock = {
      helpers: {
      }
    };

    chunkMock = {
      write: function(value) {
        return value;
      }
    };

    require('../helpers/filterSeats')(dustMock);
    done();
  });

  it('should be ok when we call it', function() {
    var params = { // we can't call this with no params then...
      venueProducts: [
        {}
      ]
    };
    expect(dustMock.helpers._filterSeats(chunkMock, null, null, params)).to.be.an('object');
  });

});
