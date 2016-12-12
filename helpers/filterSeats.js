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
  * @param {object} bandColours gets seat information from cloudant
  * @param {string} sortType price sorting
  * @param {object} seatLegend gets current colours from cloudant
  * @example {@_filterSeats sortBy="none" packageRates=packageRatesReply.packageRates venueProducts=venueProductsReply.venueProducts roomRates=packageRatesReply.linked.roomRates ticketRates=packageRatesReply.linked.ticketRates bandColours=transformer[harvest.baskets.data.event.ticket.id] seatLegend=_brandConfig["seatLegend"]["en"]} {/_filterSeats} output loop of sections with seats inside sorted by price
  */

  dust.helpers._filterSeats = function(chunk, context, bodies, params) {
    params = params || {};

    var packageRates = params.packageRates;
    var venueProduct = _.head(params.venueProducts);
    var ticketRates = params.ticketRates;
    var roomRates = params.roomRates;
    var sortType = params.sortType;
    var seatLegend = params.seatLegend;

    var bestPrice = {};
    var currentPrice, topTicket;

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

    // get the names of the best two sections from the theatre
    function getBestSections(bandColours) {
      var bestSections = [];
      // add all section names to an array
      _.forEach(bandColours, function(bands, section) {
        bestSections.push(section);
      });
      // find the best section
      return _.last(bestSections); // just Stalls
    }

    // compare prices
    function chosenForYou(ticketRate, ticketRateSection) {
      var bestSections = getBestSections(params.bandColours);
      var ticketRatePrice = ticketRates[ticketRate.ids].grossPrice;
      // check if current ticketRate exists
      if (bestSections === ticketRateSection && _.last(ticketRate.colourRank)) {
        // check if price is cheaper or exists
        if (!currentPrice || ticketRatePrice < currentPrice) {
          // assign ticket to object
          bestPrice = {
            id: ticketRate.ids,
            price: ticketRatePrice,
            colour: ticketRate.colour,
            colourRank: ticketRate.colourRank
          };
          currentPrice = ticketRatePrice;
        }
      }
      return bestPrice;
    }

    // use Transformer show config to add Gold, Silver or Bronze to packageRate
    function assignColoursToBands(ticketRate, ticketRatesSection, ticketRatesPriceBand) {
      // assign gold, silver, bronze to packages depending on their current priceBand
      _.forEach(params.bandColours, function(sectionValue, sectionKey) {
        // check for match between transformer and existing data
        // or check for section that might not have full title ( e.g. Grand Circle in Grand Circle (Left) )
        if (ticketRatesSection === sectionKey || ticketRatesSection.indexOf(sectionKey) !== -1) {
          // match transformer config to existing seat section
          _.forEach(sectionValue, function(bandValue, bandKey) {
            if (ticketRatesPriceBand === bandKey) {
              // match transformer config to existing priceBand
              // adds colour to the packageRate object for consumption in templates.
              ticketRate.colour = seatLegend[bandValue];
              ticketRate.colourRank = bandValue;
              // use information to try and find the best deal
              topTicket = chosenForYou(ticketRate, ticketRatesSection);
              if (topTicket && ticketRate.ids === topTicket) {
                ticketRate.bestOffer = true;
              }
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
          if (params.bandColours) {
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

    // For each section this function will assign each seat to its own colour,
    // then will pick the cheapest rate from each colour and sort the colours by price.
    function reorderRates(rates, replyIndex) {
      // We parse the bandColours object containing the mapping between seats and colours
      // from Transfomer in order to pick all the colours been used for the current query and
      // so we create a new object bandTypes having the coulours as keys and empty arrays as values
      var bandTypes = {};
      _.forEach(params.bandColours, function(sectionObj) {
        _.forEach(sectionObj, function(qualityNumber) {
          var qualityString = seatLegend[qualityNumber];
          bandTypes[qualityString] = [];
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
    function getLeftRightMergedSection(currSection, nextSection) {
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
    function mergeLeftRight() {
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

        var mergedSection = getLeftRightMergedSection(currSection, nextSection);
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

    // Essentially we create a new section that merge the left, centre and righ sections.
    // First we search for the central seats, if a quality in the centre is missing
    // than we search for it in the left or right section.
    // The function will return the new merged section.
    function getLeftCentreRightMergedSection(leftSection, centreSection, rightSection) {
      // First we merge the left and right sections and store the created one into
      // a variable.
      var mergedLeftRightSection = getLeftRightMergedSection(leftSection, rightSection);
      var leftRightRates = mergedLeftRightSection.rates;
      var centreRates = centreSection.rates;
      var centreColours = [];
      var newRates = [];

      // We store all the rates of the central section into an array and all
      // the colours found into another one.
      _.forEach(centreRates, function(rate) {
        centreColours.push(rate.links.ticketRates.colour);
        newRates.push(rate);
      });

      // We loop through all the rates of the left-right merged section
      // and if we find a colour that is not present in the central rates we add it
      // into the array.
      _.forEach(leftRightRates, function(rate) {
        var currColour = rate.links.ticketRates.colour;
        if (centreColours.indexOf(currColour) === -1) {
          newRates.push(rate);
        }
      });

      // We order the array of new rates that we just created by price
      newRates = _.orderBy(newRates, function(newRate) {
        return newRate.grossPrice;
      }, ['asc']);

      // We replace the name of the centre section with the merged one
      // and we replace the rates with the new array.
      centreSection.name = mergedLeftRightSection.name;
      centreSection.rates = newRates;

      return centreSection;
    }

    function mergeLeftCentreRight() {
      var targetedSectionIndexes = [];

      // We loop through all the replies and if a reply is a central section
      // then we add its index to an array of indexes in order to use them later
      _.forEach(reply, function(section, index) {
        if (section.name.toUpperCase().indexOf('CENTRE') !== -1) {
          targetedSectionIndexes.push(index);
        }
      });

      _.forEach(targetedSectionIndexes, function(centralSectionIndex) {
        centralSectionIndex = parseInt(centralSectionIndex, 10);
        // We use the index to find the left section (just before the central),
        // the central section and the right section (just after the central). Then we pass
        // these three sections to the function that return the merged section.
        var mergedSection = getLeftCentreRightMergedSection(
          reply[centralSectionIndex - 1],
          reply[centralSectionIndex],
          reply[centralSectionIndex + 1]
        );

        // We assign the merged section into the position previously occupied by
        // the central section and also we mark the left and right positions
        // as to be removed from the reply  object.
        reply[centralSectionIndex - 1].toBeRemoved = true;
        reply[centralSectionIndex + 1].toBeRemoved = true;
        reply[centralSectionIndex] = mergedSection;
      });

      // We remove the sections previously marked as to be removed through a
      // loadash filter.
      reply = _.filter(reply, function(section) {
        return !section.toBeRemoved;
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
    if ( sortType === 'price') {
      reorderReplies();
      mergeLeftRight();
      mergeLeftCentreRight();
    }
    loopAndBuildHelperOutput();
    return chunk;
  };
};
