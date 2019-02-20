/* jslint node: true */

'use strict'

var sortBy = require('../lib/sortBy')

module.exports = function (dust) {
  /*
   * @disclaimer - this is a temporary filter helper to separate a recommended hotel(s) from a list of hotels. This is temporary because it's written in dust, which will change soon.
   *
   * @description Augmented sorting method that orders a list of things based on a child node, and then filters the result based on an object and a value .
   * @param {object} parent Object to sort
   * @param {string} node Child node to sort object by
   * @param {object} filterArray - array to base the filter on
   * @param {boolean as string} isIncludedInArray - if 'true', the filter function will exclude all items in the filterArray, based on the filterValue. If false, the filter function will include only the items in the filterArray
   * @example {@_sortAndFilterHotels parent=packageRatesReply.packageRates node="grossPrice" filterArray=_brandConfig.featuredHotel filterValue="x.links.hotelProducts.ids[0]" include="true"} {/_sortAndFilterHotels} output loop of parent object sorted by node and filtered by filterArray
   */

  dust.helpers._sortAndFilterHotels = function (chunk, context, bodies, params) {
    var filterArray = params.filterArray

    if (!filterArray.length) {
      return false
    }

    var mappedObject = sortBy(params.parent, params.node)
    var newMappedObject = []

    // check whether hotels in the filterArray are in the overall list
    var mappedObjectContainsFilterArray =
      mappedObject
        .map(function (object) {
        // get the IDs of all hotels in the list
          return object.links.hotelProducts.ids[ 0 ]
        })
        .filter(function (hotelID) {
        // only return hotels with the ID of those in the filterArray
          return filterArray.indexOf(hotelID) > -1
        })
      // count
        .length

    // if filterArray exists, filter out from mappedObject
    if (params.isIncludedInArray) {
      newMappedObject = mappedObject.filter(function (object) {
        // filter mapped object, include/exclude recommended hotels from
        // hotels list based on params.isIncludedInArray value
        var hotelIndex = filterArray.indexOf(object.links.hotelProducts.ids[ 0 ])
        return (params.isIncludedInArray === 'true') ? hotelIndex > -1 : hotelIndex < 0
      })
      // if this new mapped object has anything in it, set it to mappedObject
      if (newMappedObject.length) {
        mappedObject = newMappedObject
      }
    }
    // if we are filtering only the hotels from filterArray, and the filterArray hotel
    // isn't in the overall list, then don't return anything
    // otherwise, return the filtered list
    if (params.isIncludedInArray === 'true' && !mappedObjectContainsFilterArray) {
      return false
    }

    return mappedObject.map(function (item) {
      chunk = chunk.render(bodies.block, context.push(item))
    })
  }
}
