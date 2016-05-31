/* jslint node: true */
'use strict';

var _ = require('lodash');
var sortBy = require('../lib/sortBy');

module.exports = function(dust) {

  /*
   * @description Augmented sorting method that orders a list of things based on a child node, and then filters the result based on an object and a value. 
   * @param {object} parent Object to sort
   * @param {string} node Child node to sort object by
   * @param {object} filterArray - array to base the filter on
   * @param {string} filterValue - value to check against in the filter function
   * @param {boolean as string} exclude - if 'true', the filter function will exclude all items in the filterArray, based on the filterValue
   * @param {boolean as string} include - if 'true', the filter function will include all items in the filterArray, based on the filterValue
   * @example {@_sortByNumberWithFilter parent=packageRatesReply.packageRates node="grossPrice" filterArray=_brandConfig.featuredHotel filterValue="x.links.hotelProducts.ids[0]" include="true"} {/_sortByNumberWithFilter} output loop of parent object sorted by node
   */

  dust.helpers._sortByNumberWithFilter = function(chunk, context, bodies, params) {
    var parent = params.parent;
    var node = params.node;
    var filterArray = params.filterArray;
    var filterValue = params.filterValue;
    var include = params.include;
    var exclude = params.exclude;
   
    var mappedObject = sortBy(parent, node);
    var newMappedObject = [];

    //if filterArray exists, filter out from mappedObject
    if (filterArray.length && filterValue) {
      newMappedObject = _.filter(mappedObject, function(x) {
        //filter mapped object, removing objects from filterArray
        if (exclude) {
          return filterArray.indexOf(eval(filterValue)) < 0;
        }
        else if (include) {
          return filterArray.indexOf(eval(filterValue)) > -1;
        }
      });
    }

    if (newMappedObject.length) {
      mappedObject = newMappedObject;
    }
    _.forEach(mappedObject, function(item) {
      chunk = chunk.render(bodies.block, context.push(item));
    });

    return chunk;
  };
};
