/* jslint node: true */
'use strict';

var chai = require( 'chai' );
var chaiAsPromised = require( 'chai-as-promised' );
chai.use( chaiAsPromised );
var should;
should = require( 'chai' ).should();

var dustMock;
var chunkMock;
var loadTemplate;

describe( 'Load template - Dust helpers', function() {

	before( function( done ) {
		dustMock = {
			helpers: {
				tap: function( valueToSearch ) {
					return valueToSearch || null;
				}
			}
		};

		chunkMock = {
			partial: function( value ) {
				return value;
			}
		};

		loadTemplate = require( '../helpers/loadTemplate.js' )( dustMock );
		done();
	} );

	it( 'should return "/templates/test" from "/templates/" and "test"', function( done ) {
		var params = {
			name: 'test',
			namespace: '/templates/'
		};

		dustMock.helpers._loadTemplate( chunkMock, null, null, params ).should.be.equal( '/templates/test' );
		done();
	} );

	it( 'should return "Cannot read property \'name\' of null" when no params are passed', function( done ) {
		var params = null;
		( function() {
			dustMock.helpers._loadTemplate( chunkMock, null, null, params );
		} ).should.throw( /Cannot read property 'name' of null/ );
		done();
	} );

} );
