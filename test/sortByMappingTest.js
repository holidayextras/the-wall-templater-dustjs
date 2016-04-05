/* jslint node: false */
// 'use strict';

var chai = require( 'chai' );
var chaiAsPromised = require( 'chai-as-promised' );
var helper = require( '../helpers/sortByMapping.js' )
chai.use( chaiAsPromised );
chai.should();

var dustMock;
var chunkMock;

describe( 'Sort By Mapping - Dust helpers', function() {

	it( 'should return remapped object', function( done ) {

		console.log( 'helper', helper );

		// var params = {
		// 	sortObject: [ { a: { b: 'TEST' } }, { a: { b: 'TEST2' }  } ],
		// 	map: 'TEST2, TEST',
		// 	indexes: 'a, b'
		// }

		var params = {
			sortObject: [ { a: { b: 'TEST' } }, { a: { b: 'TEST2' }  } ],
			map: 'TEST2, TEST',
			indexes: 'a, b'
		}
		var resultObject = { secondLevel: [ { sortParam: { id: [ 'TEST2' ] } }, { sortParam: { id: [ 'TEST' ] }  } ] };
		console.log( 'resultObject', resultObject );
		console.log( 'params', params.sortObject );
		console.log( 'chunkMock', chunkMock );
		console.log( 'dustMock', dustMock );

		// dust.helpers._sortByMapping = function( chunk, context, bodies, params )

		return helper._sortByMapping( {}, {}, {}, params ).to.deep.equal( resultObject );
		done();
	} );

} );
