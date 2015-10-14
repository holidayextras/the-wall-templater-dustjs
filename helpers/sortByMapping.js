/* jslint node: true */
'use strict';

var _ = require( 'lodash' );

module.exports = function( dust ) {

  /*
  * @description Sorting method that orders a list of things based on a provided map
  * @param {object} eventsObject Object to sort
  * @param {string} map Map to use to sort with
  * @example {@_sortByMapping eventsObject=eventsReply.events map="ASHLKE, ASHWKE, ASHJBE} {/_sortByMapping} output loop of events
  */

  dust.helpers._sortByMapping = function( chunk, context, bodies, params ) {
    var eventsObject = params.eventsObject;
    var map = params.map.split(','); // Split string into array

    var mappedObject = [];

    // For every item in map array
    _.forEach( map, function( id ) {
      // For every event if the id = map id then add to mappedObject
      _.forEach( eventsObject, function( event ) {
        if ( event.id === id ) {
          mappedObject.push( event );
        }
      } );
    } );

    // Smush everything else we havn't already addedd into events
    eventsObject = _.union( mappedObject, eventsObject );

    // Release - the wall didn't like me deleting this, hence null.
    mappedObject = null;

    _.forEach( eventsObject, function( item ) {
      chunk = chunk.render( bodies.block, context.push( item ) );
    } );

    return chunk;
  };
};
