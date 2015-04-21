/* jslint node: true */
'use strict';

var chai = require( 'chai' );
var chaiAsPromised = require( 'chai-as-promised' );
chai.use( chaiAsPromised );
var should;
should = require( 'chai' ).should();

var dustMock;
var chunkMock;
var formatDate;

describe( 'Format date - Dust helpers', function() {

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

		formatDate = require( '../helpers/formatDate.js' )( dustMock );
		done();
	} );

	it( 'should return "2015-01-07" from 2015-01-07', function( done ) {
		var params = {
			date: '01/07/2015', // american date :(
			format: 'YYYY-MM-DD'
		};

		dustMock.helpers._formatDate( chunkMock, null, null, params ).should.be.equal( '2015-01-07' );
		done();
	} );

	it( 'should return "Invalid date" when no params are passed', function( done ) {
		var params = null;

		dustMock.helpers._formatDate( chunkMock, null, null, params ).should.be.deep.equal( 'Invalid date' );
		done();
	} );

} );
