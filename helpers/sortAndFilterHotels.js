/* jslint node: true */
'use strict';

var _ = require('lodash');
var sortBy = require('../lib/sortBy');

module.exports = function(dust) {

  /*
   * @disclaimer - this is a temporary filter helper to separate a recommended hotel(s) from a list of hotels. This is temporary because it's written in dust, which will change soon.
   *
   * @description Augmented sorting method that orders a list of things based on a child node, and then filters the result based on an object and a value .
   * @param {object} parent Object to sort
   * @param {string} node Child node to sort object by
   * @param {object} filterArray - array to base the filter on
   * @param {boolean as string} exclude - if 'true', the filter function will exclude all items in the filterArray, based on the filterValue
   * @param {boolean as string} include - if 'true', the filter function will include all items in the filterArray
   * @example {@_sortAndFilterHotels parent=packageRatesReply.packageRates node="grossPrice" filterArray=_brandConfig.featuredHotel filterValue="x.links.hotelProducts.ids[0]" include="true"} {/_sortAndFilterHotels} output loop of parent object sorted by node and filtered by filterArray
   */

  dust.helpers._sortAndFilterHotels = function(chunk, context, bodies, params) {
    var filterArray = params.filterArray;

    var mappedObject = sortBy(params.parent, params.node);
    var newMappedObject = [];

    //if filterArray exists, filter out from mappedObject
    if (filterArray.length && params.isIncludedInArray) {
        newMappedObject = _.filter(mappedObject, function(object) {
          //filter mapped object, exclude all recommended hotels from h(otels list
          var hotelIndex = filterArray.indexOf(object.links.hotelProducts.ids[0]);
          return (params.isIncludedInArray === 'true') ? hotelIndex > -1 : hotelIndex < 0;
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
