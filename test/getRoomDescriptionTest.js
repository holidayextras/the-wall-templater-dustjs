'use strict';

var expect = require('chai').expect;

var dustMock;
var chunkMock;

describe('Get Room Description - Dust helpers', function() {
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

    require('../helpers/getRoomDescription.js')(dustMock);
    done();
  });

  it('should return "Double room"', function() {
    var params = {
      occupancytype: 'DBL',
      adults: 2,
      children: 0,
      infants: 0
    };

    expect(dustMock.helpers._getRoomDescription(chunkMock, null, null, params)).to.be.equal('Double room');
  });

  it('should return "Accessible room - 2 Single Beds  with Bunk Beds and pull out bed "', function() {
    var params = {
      roomdescription: 'Accessible room - 2 Single Beds  with Bunk Beds and pull out bed',
      occupancytype: 'QUAD',
      adults: 2,
      children: 2,
      infants: 0
    };

    expect(dustMock.helpers._getRoomDescription(chunkMock, null, null, params)).to.be.equal('Accessible room - 2 Single Beds  with Bunk Beds and pull out bed');
  });

});
