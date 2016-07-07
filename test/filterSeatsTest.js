'use strict';

var expect = require('chai').expect;
var _ = require( 'lodash' );

var dustMock;
var chunkMock;
var bodies;
var context;

var loadTestResource = function( resource ) {
  return _.cloneDeep( require( './' + resource ) );
};

describe('Filter seats - Dust helpers', function() {

  before(function(done) {
    var returnEasy = function(value) {
      return value;
    };
    dustMock = {
      helpers: {
        tap: function(valueToSearch) {
          return valueToSearch || null;
        }
      }
    };
    chunkMock = {
      write: returnEasy,
      render: function(bodiesFunction, value) {
        // We don't care about bodiesFunction, we just want to see what the value would be
        chunkMock.data.push(value);
        return chunkMock;
      },
      data: []
    };
    bodies = {
      block: returnEasy
    };
    context = {
      push: returnEasy
    };

    require('../helpers/filterSeats.js')(dustMock);
    done();
  });

  it('should return seats grouped by quality and ordered by price', function() {
    var params = loadTestResource('fixtures/filterSeatsParams');
    var expected = loadTestResource('expected/filterSeatsOutput');

    var output = dustMock.helpers._filterSeats(chunkMock, context, bodies, params);

    _.forEach(output.data, function(reply, replyIndex) {
      expect(reply.name).to.be.equal(expected[replyIndex].name);
      var rates = reply.rates;
      var expectedRates = expected[replyIndex].rates;
      _.forEach(rates, function(rate, rateIndex) {
        expect(rate.grossPrice).to.be.equal(expectedRates[rateIndex].grossPrice);
        expect(rate.links.ticketRates.colour).to.be.equal(expectedRates[rateIndex].links.ticketRates.colour);
      });
    });
  });

});
