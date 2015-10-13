/* jslint node: true */
'use strict';

var _ = require( 'lodash' );
var sortBy = require( '../lib/sortBy' );

module.exports = function( dust ) {

  /*
  * @description Sorting method that orders a list of things based on a child node, which is a number
  * @param {object} parent Object to sort
  * @param {string} node Child node to sort object by
  * @example {@_sortByNumber parent=packageRatesReply.packageRates node="grossPrice"} {/_sortByNumber} output loop of parent object sorted by node
  */

  dust.helpers._sortByNumber = function( chunk, context, bodies, params ) {
    var parent = params.parent;
    var node = params.node;

    delete params.parent;
    delete params.node;

    var mappedObject = sortBy( parent, node );

    _.forEach( mappedObject, function( item ){
      chunk = chunk.render( bodies.block, context.push( item ) );
    } );

    return chunk;
  };
};