/* jslint node: true */
'use strict';

var moment = require( 'moment' );

module.exports = function( dust ) {

  /*
  * @description Calculate a customer's check-out date based on their check-in date and the amount of nights they have booked
  * @param {string} startDate start date
  * @param {string} nights amount of nights
  * @param {string} [type=days] the measurement of time to add to
  * @example {@_calcEndDate startDate="07/01/2015" nights="3" type="days" /} output "10/01/2015"
  */

  dust.helpers._calcEndDate = function( chunk, context, bodies, params ) {
    if (!params) {
      return NaN;
    }
    params = params || {};
    var startDate = dust.helpers.tap( params.startDate, chunk, context );
    var nights = dust.helpers.tap( params.nights, chunk, context );
    var type = dust.helpers.tap( params.type, chunk, context ) || 'days';
    var format = dust.helpers.tap( params.format, chunk, context );
    return chunk.write( moment.utc( startDate ).add( nights, type ).format( format ) );
  };
};
