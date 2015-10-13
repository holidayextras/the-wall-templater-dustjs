/* jslint node: true */
'use strict';

var _ = require( 'lodash' );

function sortBy( parent, node ) {

  var mapped = _.sortBy( parent, function( child ) {
    return child[node];
  } );

  return mapped;
}

module.exports = exports = sortBy;
