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
    var sortByInput = params.sortBy;

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
    function assignColoursToBands(ticketRate, ticketRatesSection, ticketRatesPriceBand) {
      // assign gold, silver, bronze to packages depending on their current priceBand
      _.forEach(bandColours, function(sectionValue, sectionKey) {
        // check for match between transformer and existing data
        // or check for section that might not have full title ( e.g. Grand Circle in Grand Circle (Left) )
        if (ticketRatesSection === sectionKey || ticketRatesSection.indexOf( sectionKey ) > -1 ) {
          // match transformer config to existing seat section
          _.forEach(sectionValue, function(bandValue, bandKey) {
            if (ticketRatesPriceBand === bandKey) {
              // match transformer config to existing priceBand
              // adds colour to the packageRate object for consumption in templates.
              ticketRate.colour = bandValue;
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
        var ticketRate = ticketRates[packageRate.links.ticketRates.ids];
        if (ticketRate.section === item.name) {
          // WEB-8081
          // make sure Transformer configuration has been pulled
          if (bandColours) {
            assignColoursToBands(packageRate.links.ticketRates, ticketRate.section, ticketRate.priceBand);
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

    function reorderRates(rates, replyIndex) {
      var bandTypes = {};
      _.forEach(bandColours, function (sectionObj) {
        _.forEach(sectionObj, function (quality) {
          bandTypes[quality] = [];
        });
      });

      var newRates = [];

      // 1 - Push each rate to its own colour array (bandTypes)
      _.forEach(rates, function(rate) {
        var quality = rate.links.ticketRates.colour;
        if (!quality) {
          return;
        }
        bandTypes[quality].push(rate);
      });
      // 2 - Order each bandTypes array by price and from each ordered array
      // pick the cheapest rate and push it into the newRates array
      _.forEach(bandTypes, function(bandType, key) {
        bandType = _.orderBy(bandType, function(rate) {
          return rate.grossPrice;
        }, ['asc']);

        if (bandType.length) {
          bandTypes[key] = bandType;
          newRates.push(bandType[0]);
        }
      });
      // 3 - Order the cheapest rates selected in the step before by price
      newRates = _.orderBy(newRates, function(newRate) {
        return newRate.grossPrice;
      }, ['asc']);

      reply[replyIndex].rates = newRates;
    }
    // For each reply we want to order the inner 'rates' array by price
    // and then we want to reorder the replies themselves always by price
    // taking in consideration just the cheapest rate of each
    function reorderReplies() {
      _.forEach(reply, function(section, i) {
        reorderRates(section.rates, i);
      });
    }

    // Check if the name of the current section and the name of the next section
    // differ just for (Left) and (Right) and if they do then return the merged name.
    // Otherwise return false.
    function getMergedName(currSectionName, nextSectionName) {
      var _name1 = currSectionName
        .toUpperCase()
        .replace(' ', '')
        .replace('(LEFT)', '')
        .replace('(RIGHT)', '');

      var _name2 = nextSectionName
        .toUpperCase()
        .replace(' ', '')
        .replace('(LEFT)', '')
        .replace('(RIGHT)', '');

      if (_name1 !== _name2) {
        return false;
      }

      return currSectionName
        .replace('(Left)', '')
        .replace('(Right)', '')
        .trim();
    }

    // If the current section and the next one need to be merged,
    // create and return a new merged section with a new array of rates otherwise return false.
    // The new array of rates will contain the cheapest gold between left and right,
    // the cheapest silver between left and right and so on.
    // If the rate of the left section is equal to the one on the right then we will
    // have 50% of probability to get the one on the left or the one on the right.
    function getMergedSection(currSection, nextSection) {
      var mergedReply = currSection;
      var newName = getMergedName(currSection.name, nextSection.name);
      if (!newName) {
        return false;
      }

      // Concatenate left rates with the right ones
      var mixedRates = currSection.rates.concat(nextSection.rates);
      var newRatesObj = {};

      for (var i = 0; i < mixedRates.length; i++) {
        var currRate = mixedRates[i];
        var currColour = currRate.links.ticketRates.colour;

        // We only assign the currRate to its colour only:
        // 1. If the currColour key has still an empty value
        // 2. If the price of the current rate is cheaper than the previously assigned one
        // 3. If the price of the current rate is equal to the previously assigned one. In
        //    this case we have 50% of probability that the currRate will be assigned instead
        //    of the previous one.
        var condition = !newRatesObj[currColour]
          || (currRate.grossPrice < newRatesObj[currColour].grossPrice)
          || ((currRate.grossPrice === newRatesObj[currColour].grossPrice) && Math.random() >= 0.5);

        if (condition) {
          newRatesObj[currColour] = currRate;
        }
      }

      mergedReply.name = newName;
      mergedReply.rates = _.values(newRatesObj);

      return mergedReply;
    }

    // Loop through each section to see if the current section needs
    // to be merged with the next one (i.e. Grand Circle (Left) and Grand Circle (Right))
    // at the end we will have a new list of sections where left and right have been merged.
    function mergeReplies() {
      var newReply = {};
      var loopMax = _.size(reply);

      for (var i = 0, newReplyIndex = 0; i < loopMax; i++, newReplyIndex++) {
        var currSection = reply[i];
        var nextSection = reply[i + 1];

        // if there is no nextSection we can stop looping
        if (!nextSection) {
          newReply[newReplyIndex] = currSection;
          break;
        }

        var mergedSection = getMergedSection(currSection, nextSection);
        // If we received a merged section from the 'getMergedSection' function
        // we can push the merged section into the newReply object and increase the index
        // by one so that the next loop will skip the check for the nextSection.
        if (mergedSection) {
          newReply[newReplyIndex] = mergedSection;
          i++;
        } else {
          newReply[newReplyIndex] = currSection;
        }
      }

      reply = newReply;
    }

    function loopAndBuildHelperOutput() {
      // Loop through finalised reply and add each theatre section to context for looping in template
      _.forEach(reply, function(item) {
        chunk = chunk.render(bodies.block, context.push(item));
      });
    }

    findCheapestRoom();
    loopPackageRatesAndEqualsCheapest();
    if ( sortByInput === 'price') {
      reorderReplies();
      mergeReplies();
    }
    loopAndBuildHelperOutput();


    return chunk;

  };
};
