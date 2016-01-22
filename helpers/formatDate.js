/* jslint node: true */
'use strict';

var moment = require( 'moment' );

module.exports = function( dust ) {

  /*
  * @description Extend dustjs with a date formatting helper courtesy of momentjs
  * @param {string} date date which you want to format differently
  * @param {string} format format which the date will be outputed
  * @example {@_formatDate date="07/01/2015" format="YYYY-mm-dd" /} output 2015-01-07
  */

  dust.helpers._formatDate = function( chunk, context, bodies, params ) {
    params = params || {};
    var date = dust.helpers.tap( params.date, chunk, context );
    var format = dust.helpers.tap( params.format, chunk, context );
    // simply use moment to turn the passed date into the passed format
    return chunk.write( moment.utc( date ).format( format ) );
  };

};
