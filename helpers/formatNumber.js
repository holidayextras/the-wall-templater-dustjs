/* jslint node: true */
'use strict';

var numeral = require( 'numeral' );

module.exports = function( dust ) {

	/*
	* @description Extend dustjs with a number formatting helper courtesy of numeraljs http://numeraljs.com/
	* @param number is the number you want to manipulate
	* @param format is the number to output as, for more formats http://numeraljs.com/
	* @example {@_formatNumber number="1000" format="[0,000].00" /} output 1,000.00
	*/

	dust.helpers._formatNumber = function( chunk, context, bodies, params ) {
		params = params || {};
		var number = dust.helpers.tap( params.number, chunk, context );
		var format = dust.helpers.tap( params.format, chunk, context );
		// simply use numeral to turn the passed number into the passed format
		return chunk.write( numeral( number ).format( format ) );
	};

};
