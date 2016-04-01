/* jslint node: true */
'use strict';

var _ = require( 'lodash' );

module.exports = function( dust ) {

  /*
  * @description Sorting method that orders a list of things based on a provided map
  * @param {object} eventsObject Object to sort
  * @param {string} map Map to use to sort with
  * @param {string} sortKeys - structure of response to sort on
  * @example {@_sortByMapping sortObject=eventsReply.events sortKeys="links hotelProducts ids" map="PAUGLA, PAUFOR, PAUELM, PAUFAR"} {/_sortByMapping}
  */

  dust.helpers._sortByMapping = function( chunk, context, bodies, params ) {
    // Object to sort
    var sortObject = params.sortObject;
    // Map to sort to
    var map = params.map;
    // Keys required for mapping
    var keysParam = params.sortKeys.split(' ');

    var mappedObject = [];

    var sortParameters = function( events, sortparams ) {
      // Loop over sort parameter structure passed in tpl
      for ( var i=0; i < sortparams.length; i ++ ) { 
        if ( !events ) return null;
        events = events[sortparams[i]];
      }
      return events;
    };
    // For every item in map array passed
    _.forEach( map, function( id ) {
      // Loop over the object to be sorted
      _.forEach( sortObject, function( matchObject ) {
        var requiredProduct = sortParameters( matchObject, keysParam );
        // Is the product in the map
        if ( _.include( id, requiredProduct ) ) {
          // If it matches need to push this object into mappedObject
          mappedObject.push( matchObject );
        }
      } );
    } );

    // Smush everything else we havn't already addedd into events
    sortObject = _.union( mappedObject, sortObject );

    // Release - the wall didn't like me deleting this, hence null.
    mappedObject = null;

    _.forEach( sortObject, function( item ) {
      chunk = chunk.render( bodies.block, context.push( item ) );
    } );

    return chunk;
  };
};
