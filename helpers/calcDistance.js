/* jslint node: true */
'use strict';

module.exports = function( dust ) {

  /*
  * @description Extend dustjs so we can calc distance from two lat + long
  * @param {string} name template name
  * @param {string} namespace path of the template
  * @example {@_loadTemplate name="test" namespace="/templates" /} output template content
  */

  //lat1, lon1, lat2, lon2, unit

  dust.helpers._calcDistance = function( chunk, context, bodies, params ) {
    var lat1 = dust.helpers.tap( params.lat1, chunk, context );
    var lon1 = dust.helpers.tap( params.lon1, chunk, context );
    var lat2 = dust.helpers.tap( params.lat2, chunk, context );
    var lon2 = dust.helpers.tap( params.lon2, chunk, context );
    var unit = dust.helpers.tap( params.unit, chunk, context );

    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var radlon1 = Math.PI * lon1/180;
    var radlon2 = Math.PI * lon2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin( radlat1 ) * Math.sin( radlat2 ) + Math.cos( radlat1 ) * Math.cos( radlat2 ) * Math.cos( radtheta );
    dist = Math.acos( dist );
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    if ( unit=="K" ) { dist = dist * 1.609344 }
    if ( unit=="N" ) { dist = dist * 0.8684 }

    return chunk.write( dist.toFixed( decimalPlaces ) );
  };
};