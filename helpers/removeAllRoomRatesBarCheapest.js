/* jslint node: true */
'use strict';

var _ = require( 'lodash' );

module.exports = function( dust ) {

	/*
	* @description Find cheapest hotel and strip rest from api reply.
	* @param {string} object
	* @example {@_forEach object=Object /}
	*/

	// This whole helper is very specific, needs to be rewritten asap.
	dust.helpers._removeAllRoomRatesBarCheapest = function( chunk, context, bodies, params ) {
		params = params || {};

		// Use our params
		var roomRates = params.object.linked.roomRates;
		var packageRates = params.object.packageRates;
		// Toss the used ones, so we can return everything else to the template
		delete params[ 'object' ];
		
		var cheapestRoom = { id: 0, price: -1};

		_.forEach( roomRates, function( roomRate ){
			if( roomRate.grossPrice < cheapestRoom.price || cheapestRoom.price === -1 ) {
				cheapestRoom = { id: roomRate.id, price: roomRate.grossPrice };
			}
		} );

		_.forEach( packageRates, function( packageRate ) {
			if ( packageRate.links.roomRates.ids === cheapestRoom.id ){
				chunk = chunk.render( bodies.block, context.push( params ).push( packageRate ) );
			}
		} );

		return chunk;
	};

};
