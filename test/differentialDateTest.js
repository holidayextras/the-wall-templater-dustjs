/* jslint node: true */
'use strict';

var chai = require( 'chai' );
var chaiAsPromised = require( 'chai-as-promised' );
chai.use( chaiAsPromised );
var should;
should = require( 'chai' ).should();

var dustMock;
var chunkMock;
var differentialDate;

describe( 'Differential date - Dust helpers', function() {

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

		differentialDate = require( '../helpers/differentialDate.js' )( dustMock );
		done();
	} );

	it( 'should return "3" (days) betwen "2015-01-07" and "2015-01-10" and type of "days"', function( done ) {
		var params = {
			startDate: '01/07/2015', // american date :(
			endDate: '01/10/2015', // american date :(
			type: 'days'
		};

		dustMock.helpers._differentialDate( chunkMock, null, null, params ).should.be.equal( 3 );
		done();
	} );

	it( 'should return "4" (days) betwen "2015-01-08" and "2015-01-12" and no type', function( done ) {
		var params = {
			startDate: '01/08/2015', // american date :(
			endDate: '01/12/2015' // american date :(
		};

		dustMock.helpers._differentialDate( chunkMock, null, null, params ).should.be.equal( 4 );
		done();
	} );

	it( 'should return "NaN" when no params are passed', function( done ) {
		var params = null;

		dustMock.helpers._differentialDate( chunkMock, null, null, params ).should.be.deep.equal( NaN );
		done();
	} );

} );
