/* jslint node: true */
'use strict';

var chai = require( 'chai' );
chai.use( require( 'chai-as-promised' ) );
chai.should();

var dustMock;
var chunkMock;

describe( 'Calculate end date - Dust helpers', function() {

  before( function( done ) {
    dustMock = {
      helpers: {
        tap: function( valueToSearch ) {
          return valueToSearch || null;
        }
      }
    };

    chunkMock = {
      write: function( value ) {
        return value;
      }
    };

    require( '../helpers/calculateEndDate.js' )( dustMock );
    done();
  } );

  it( 'should return string of "2015-10-10" from "2015-10-07" and 3 nights with type days', function() {
    var params = {
      startDate: '2015-10-07',
      nights: 3,
      type: 'days'
    };

    return dustMock.helpers._calculateEndDate( chunkMock, null, null, params ).should.be.a( 'string' ).that.equals( '2015-10-10T00:00:00+00:00' );
  } );

  it( 'should return "NaN" when no params are passed', function() {
    var params = null;

    return dustMock.helpers._calculateEndDate( chunkMock, null, null, params ).should.be.deep.equal( NaN );
  } );
  it( 'should return error, "negative numbers are not allowed" when negative night amount is passed', function() {
    var params = {
      startDate: '2015-10-07',
      nights: -3,
      type: 'days'
    };

    return dustMock.helpers._calculateEndDate( chunkMock, null, null, params ).should.be.a( 'string' ).that.equals( 'Negative numbers are not allowed.' );
  } );

} );