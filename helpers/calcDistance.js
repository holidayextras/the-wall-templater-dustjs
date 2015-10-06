/* jslint node: true */
'use strict';

module.exports = function( dust ) {

  /*
  * @description Extend dustjs so we can calc distance from two lat + long
  * @param {number} lat1 latitude of first position
  * @param {number} lon1 longitude of first position
  * @param {number} lat2 latitude of second position
  * @param {number} lon2 longitude of second position
  * @param {string} unit defaults to M (Miles), accepts K (Kilometers) and N (nautical miles)
  * @param {number} decimalPlaces how many decimal places to return
  * @example {@_calcDistance lat1=50.0000 lon1=0.12000 lat2=51.0000 lon2=0.11000- decimalPlaces=2} {/_calcDistance} output template distance
  */

  dust.helpers._calcDistance = function( chunk, context, bodies, params ) {
    var lat1 = dust.helpers.tap( params.lat1, chunk, context );
    var lon1 = dust.helpers.tap( params.lon1, chunk, context );
    var lat2 = dust.helpers.tap( params.lat2, chunk, context );
    var lon2 = dust.helpers.tap( params.lon2, chunk, context );
    var unit = dust.helpers.tap( params.unit, chunk, context );
    var decimalPlaces = dust.helpers.tap( params.decimalPlaces, chunk, context ) || 2;

    function degreeToRadian( degree ) {
      return Math.PI * degree / 180;
    }

    var radlat1 = degreeToRadian( lat1 );
    var radlat2 = degreeToRadian( lat2 );
    var theta = lon1 - lon2;
    var radtheta = degreeToRadian( theta );
    var dist = Math.sin( radlat1 ) * Math.sin( radlat2 ) + Math.cos( radlat1 ) * Math.cos( radlat2 ) * Math.cos( radtheta );
    dist = Math.acos( dist );
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;

    // K = kilometeres
    // N = nautical miles.
    if ( unit === 'K' ) {
      dist = dist * 1.609344;
    }
    if ( unit === 'N' ) {
      dist = dist * 0.8684;
    }

    return chunk.write( dist.toFixed( decimalPlaces ) );
  };
};
