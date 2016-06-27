'use strict';

var _ = require('lodash');
var sortBy = require('../lib/sortBy');

module.exports = function(dust) {

  /*
  * @description A filter that nests package rates under theatre sections - Needs to be moved
  * @param {object} packageRates Package Rates
  * @param {object} venueProducts venue products
  * @param {object} ticketRates ticket rates
  * @param {object} roomRates room rates
  * @example {@_filterSeats packageRates=packageRatesReply.packageRates venueProducts=venueProductsReply.venueProducts roomRates=packageRatesReply.linked.roomRates ticketRates=packageRatesReply.linked.ticketRates} {/_filterSeats} output loop of sections with seats inside sorted by price
  */

  dust.helpers._filterSeats = function(chunk, context, bodies, params) {
    params = params || {};

    var packageRates = params.packageRates;
    var venueProduct = _.head(params.venueProducts);
    var ticketRates = params.ticketRates;
    var roomRates = params.roomRates;
    var bandColours = params.bandColours;

    var cheapestRoom = {
      id: 0,
      price: -1
    };

    var reply = {};

    function stubReply() {
      // Stub reply for rates filling in
      // Make new node for every section a theatre has.
      _.forEach(venueProduct.sections, function(section, i) {
        var item = {
          name: section,
          rates: []
        };
        reply[i] = item;
      });
    }

    stubReply();

    // Sort packageRates by Price Ascending.
    var sortedPackageRates = sortBy(packageRates, 'grossPrice');

    function findCheapestRoom() {
      // Find cheapest room rate ID
      _.forEach(roomRates, function(roomRate) {
        if (roomRate.grossPrice < cheapestRoom.price || cheapestRoom.price === -1) {
          cheapestRoom = {
            id: roomRate.id,
            price: roomRate.grossPrice
          };
        }
      });
    }

    // use Transformer show config to add Gold, Silver or Bronze to packageRate
    function assignColoursToBands(packageRate) {
      console.log( '**', packageRate );
      // assign gold, silver, bronze to packages depending on their current priceBand
      _.forEach(bandColours, function(sectionValue, sectionKey) {
        // check for match between transformer and existing data
        // check for section that might not have full title ( e.g. Grand Circle in Grand Circle (Left) )
        if (ticketRates[packageRate.ids].section === sectionKey || ticketRates[packageRate.ids].section.indexOf( sectionKey ) > -1 ) {
          // match transformer config to existing seat section
          _.forEach(sectionValue, function(bandValue, bandKey) {
            if (ticketRates[packageRate.ids].priceBand === bandKey) {
              // match transformer config to existing priceBand
              ticketRates[packageRate.ids].colour = bandValue;
            }
          });
        }
      });
    }

    function loopReplySections(packageRate) {
      // For every section in the stubbed out reply
      // check if the current package rate is in the current section
      _.forEach(reply, function(item, i) {
        // If so then we want to add this packageRate under the theatre section.
        if (ticketRates[packageRate.links.ticketRates.ids].section === item.name) {
          // WEB-8081
          if (bandColours !== null) {
            assignColoursToBands(packageRate.links.ticketRates);
          }
          reply[i].rates.push(packageRate);
        }
      });
    }

    function loopPackageRatesAndEqualsCheapest() {
      // Loop through the sorted PackageRates
      _.forEach(sortedPackageRates, function(packageRate) {
        // If it has the cheapest room rate keep it, otherwise do nothing.
        if (_.head(packageRate.links.roomRates.ids) === cheapestRoom.id) {
          loopReplySections(packageRate);
        }
      });
    }

    function loopAndBuildHelperOutput() {
      // Loop through finalised reply and add each theatre section to context for looping in template
      _.forEach(reply, function(item) {
        chunk = chunk.render(bodies.block, context.push(item));
      });
    }

    findCheapestRoom();
    loopPackageRatesAndEqualsCheapest();
    loopAndBuildHelperOutput();


    return chunk;

  };
};
