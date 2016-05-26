
/* jslint node: true */
'use strict';

var _ = require('lodash');
var sortBy = require('../lib/sortBy');

module.exports = function (dust) {

  /*
  * @description Sorting method that orders a list of things based on a child node, which is a number
  * @param {object} parent Object to sort
  * @param {string} node Child node to sort object by
  * @example {@_sortByNumber parent=packageRatesReply.packageRates node="grossPrice"} {/_sortByNumber} output loop of parent object sorted by node
  */

  dust.helpers._sortByNumberWithFilter = function (chunk, context, bodies, params) {
    var parent = params.parent;
    var node = params.node;
    var filterArray = params.filterArray;
    var filterValue = params.filterValue

    var mappedObject = sortBy(parent, node);
    var newMappedObject = [];
    
    //if filterArray exists, filter out from mappedObject 
    if (filterArray.length) {
      newMappedObject = _.filter(mappedObject, function (x) {     
        //filter mapped object, removing objects from filter array
        return filterArray.indexOf(x.filterValue) < 0;
      });
    }

    if (newMappedObject.length) {
      mappedObject = newMappedObject;
    }
    _.forEach(mappedObject, function (item) {
      chunk = chunk.render(bodies.block, context.push(item));
    });

    return chunk;
  };
};
