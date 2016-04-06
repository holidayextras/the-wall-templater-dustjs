/* jslint node: true */
'use strict';

var _ = require( 'lodash' );

module.exports = function( dust ) {

  /*
  * @description Sorting method that orders a list of things based on a provided map
  * @param {object} sortObject - Object you wish to sort
  * @param {array} map - Order you wish to sort the sortObject
  * @param {string} indexes - The node structure of object you are sorting by
  * @example {@_sortByMapping sortObject=packageRatesReply.packageRates indexes="links, hotelProducts, ids" map="PAUGLA, PAUFOR, PAUELM, PAUFAR"} {/_sortByMapping}
  * At present their is no unit test coverage for this helper, this is being addressed by changing the structure of our helpers to ensure functions available outside scope of dust
  */

  dust.helpers._sortByMapping = function( chunk, context, bodies, params ) {
    // Object to sort
    var sortObject = params.sortObject;
    // Mapping to sort to the object to
    var sortMap = params.map;
    // Index structure required for correct mapping
    var sortIndex = params.indexes.split(',');

    var mappedObject = [];

    var pickParameters = function( matchedObject, pickParams ) {
      // Loop over the object to be sorted using the index structure provided from the tpl
      for ( var i = 0; i < pickParams.length; i++ ) {
        if ( !matchedObject ) return null;
        matchedObject = matchedObject[pickParams[i]];
      }
      return matchedObject;
    };
    // Loop over the mapping order provided
    _.forEach( sortMap, function( id ) {
      // Loop over the object to be sorted
      _.forEach( sortObject, function( matchObject ) {
        var requiredProduct = pickParameters( matchObject, sortIndex );
        // Take the result of the sort object search to check if the value in the map array?
        if ( _.include( id, requiredProduct ) ) {
          // If it is in the map then push this object into the mappedObject
          mappedObject.push( matchObject );
        }
      } );
    } );

    // Smush everything else we havn't already added into sortObject
    sortObject = _.union( mappedObject, sortObject );

    _.forEach( sortObject, function( item ) {
      chunk = chunk.render( bodies.block, context.push( item ) );
    } );

    return chunk;
  };
};
