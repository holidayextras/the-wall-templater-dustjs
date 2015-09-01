/* jslint node: true */
'use strict';

var chai = require( 'chai' );
var chaiAsPromised = require( 'chai-as-promised' );
chai.use( chaiAsPromised );
chai.should();

var dustMock;
var chunkMock;
var bodies;
var context;

describe( 'Loop - Dust helpers', function() {

  before( function( done ) {
    var returnEasy = function( value ) {
      return value;
    };
    dustMock = {
      helpers: {
        tap: function( valueToSearch ) {
          return valueToSearch || null;
        }
      }
    };
    chunkMock = {
      write: returnEasy,
      render: function( bodiesFunction, value ) {
        // We don't care about bodiesFunction, we just want to see what the value would be
        return value;
      }
    };
    bodies = {
      block: returnEasy
    };
    context = {
      push: returnEasy
    };

    require( '../helpers/loop.js' )( dustMock );
    done();
  } );

  it( 'should loop upwards', function( done ) {
    var params = {
      from: 0,
      to: 2
    };

    dustMock.helpers._loop( chunkMock, context, bodies, params ).should.equal( 2 );
    done();
  } );

  it( 'should loop downwards', function( done ) {
    var params = {
      from: 2,
      to: 0
    };

    dustMock.helpers._loop( chunkMock, context, bodies, params ).should.equal( 0 );
    done();
  } );

  it( 'should loop downwards and convert strings to numbers', function( done ) {
    var params = {
      from: '2',
      to: '0'
    };

    dustMock.helpers._loop( chunkMock, context, bodies, params ).should.equal( 0 );
    done();
  } );

} );
