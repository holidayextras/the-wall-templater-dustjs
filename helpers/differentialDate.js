/* jslint node: true */
'use strict';

var moment = require( 'moment' );

module.exports = function( dust ) {

	/*
	* @description Extend dustjs with a date differential helper courtesy of momentjs
	* @param {string} startDate start date
	* @param {string} endDate end date
	* @param {string} [type=days] the type of output you want
	* @example {@_differentialDate startDate="07/01/2015" endDate="10/01/2015" type="days" /} output 3
	*/

	dust.helpers._differentialDate = function( chunk, context, bodies, params ) {
		params = params || {};
		var startDate = dust.helpers.tap( params.startDate, chunk, context );
		var endDate = moment( dust.helpers.tap( params.endDate, chunk, context ) );
		var type = dust.helpers.tap( params.type, chunk, context ) || 'days';
		// diff from end date back to start date, because moment likes it like that
		return chunk.write( endDate.diff( startDate, type ) );
	};

};
