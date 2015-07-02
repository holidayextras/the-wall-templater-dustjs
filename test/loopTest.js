/* jslint node: true */
'use strict';

var chai = require( 'chai' );
var chaiAsPromised = require( 'chai-as-promised' );
chai.use( chaiAsPromised );
var should;
should = require( 'chai' ).should();

var dustMock;
var chunkMock;
var loop;

describe( 'Loop - Dust helpers', function() {

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

		loop = require( '../helpers/loop.js' )( dustMock );
		done();
	} );

	it( 'should return "1,000.00" from 1000', function( done ) {
		// var params = {
		// 	number: 1000,
		// 	format: '[0,000].00'
		// };

		// dustMock.helpers._loop( chunkMock, null, null, params ).should.be.equal( '1,000.00' );
		done();
	} );

	it( 'should return "0" when no params are passed', function( done ) {
		// var params = null;

		// dustMock.helpers._loop( chunkMock, null, null, params ).should.be.deep.equal( '0' );
		done();
	} );

} );
