/* jslint node: true */
'use strict';

var _ = require( 'lodash' );

module.exports = function( dust ) {

  /*
  * @description Sorting method that orders a list of things based on a provided map
  * @param {object} sortObject - Object to sort
  * @param {string} map - Map to use to sort with
  * @param {string} indexes - index structure of response to sort on
  * @example {@_sortByMapping sortObject=packageRatesReply.packageRates indexes="links, hotelProducts, ids" map="PAUGLA, PAUFOR, PAUELM, PAUFAR"} {/_sortByMapping}
  * At present their is no unit test coverage for this helper, this is being addressed by changing the structure of our helpers to ensure functions available outside scope of dust
  */

  dust.helpers._sortByMapping = function( chunk, context, bodies, params ) {
    // Object to sort
    var sortObject = params.sortObject;
    // Mapping to sort to the object to
    var map = params.map;
    // Index structure required for correct mapping
    var keysParam = params.indexes.split(',');

    var mappedObject = [];

    var pickParameters = function( matchedobject, pickparams ) {
      // Loop over the object to be sorted using the index structure provided from the tpl
      for ( var i = 0; i < pickparams.length; i++ ) {
        if ( !matchedobject ) return null;
        matchedobject = matchedobject[pickparams[i]];
      }
      return matchedobject;
    };
    // Loop over the mapping order provided
    _.forEach( map, function( id ) {
      // Loop over the object to be sorted
      _.forEach( sortObject, function( matchObject ) {
        var requiredProduct = pickParameters( matchObject, keysParam );
        // Is the value in the map array?
        if ( _.include( id, requiredProduct ) ) {
          // If it matches then push this object into the mappedObject
          mappedObject.push( matchObject );
        }
      } );
    } );

    // Smush everything else we havn't already addedd into sortObject
    sortObject = _.union( mappedObject, sortObject );

    // Release - the wall didn't like me deleting this, hence null.
    mappedObject = null;

    _.forEach( sortObject, function( item ) {
      chunk = chunk.render( bodies.block, context.push( item ) );
    } );

    return chunk;
  };
};
