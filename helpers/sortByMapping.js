/* jslint node: true */
'use strict';

var _ = require( 'lodash' );

var SortByMapping = module.exports = {};

SortByMapping.initialise = function() {
  console.log('initalise');
  return SortByMapping._sortByMapping;
}

/*
* @description Sorting method that orders a list of things based on a provided map
* @param {object} sortObject - Object to sort
* @param {string} map - Map to use to sort with
* @param {string} indexes - index structure of response to sort on
* @example {@_sortByMapping sortObject=packageRatesReply.packageRates indexes="links, hotelProducts, ids" map="PAUGLA, PAUFOR, PAUELM, PAUFAR"} {/_sortByMapping}
*/
SortByMapping._sortByMapping = function( chunk, context, bodies, params ) {
  console.log('Inside');
  // Object to sort
  var sortObject = params.sortObject;
  // Map to sort to
  var map = params.map.split( ', ' );
  // Keys required for mapping
  var keysParam = params.indexes.split(', ');

  console.log('HERE');
  console.log( 'chunk', chunk );
  console.log( 'context', context );
  console.log( 'bodies', bodies );
  console.log( 'sortObject - inside', sortObject );
  console.log( 'map - inside', map );
  console.log( 'keysParam - inside', keysParam );

  var x = SortByMapping._doStuff( sortObject, map, keysParam );

  console.log( 'x', x );

  _.forEach( x, function( item ) {
    chunk = chunk.render( bodies.block, context.push( item ) );
  } );

  // console.log( 'Chunk -inside', chunk );

  return chunk;
};

SortByMapping._doStuff = function( sortObject, map, keysParam ) {
  var mappedObject = [];

  var pickParameters = function( matchedobject, pickparams ) {
    // console.log( 'pickParameters' );
    // console.log( 'pickparams', pickparams );
    // Loop over sort parameter structure passed in tpl
    for ( var i = 0; i < pickparams.length; i++ ) {
      if ( !matchedobject ) return null;
      matchedobject = matchedobject[pickparams[i]];
    }
    // console.log('matchedobject', matchedobject );
    
    return matchedobject;
  };
  // For every item in map array passed
  _.forEach( map, function( id ) {
    // Loop over the object to be sorted
    _.forEach( sortObject, function( matchObject ) {
      var requiredProduct = pickParameters( matchObject, keysParam );
      // Is the product in the map array?
      if ( id === requiredProduct ) {
        // If it matches need to push this object into mappedObject
        mappedObject.push( matchObject );
      }
    } );
  } );

  // Smush everything else we havn't already addedd into sortObject
  var sortObject = _.union( mappedObject, sortObject );

  // Release - the wall didn't like me deleting this, hence null.
  mappedObject = null;

  return sortObject;

};