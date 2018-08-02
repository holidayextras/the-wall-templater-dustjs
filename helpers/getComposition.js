'use strict';

var pluralise = require('../lib/pluralise');

module.exports = function(dust) {

  /*
  * @description Extend dustjs with a helper which retrieves hotel room descriptions
  * for offsite hotels - function adds occupancyType, adults, children to create the
  * roomType key e.g. 'TWIN11' this is then used to return the roomDescription
  * @param {string} occupancyType, room code i.e. 'SGL', 'TWIN'
  * @param {string} adults, number of adults i.e. 1,2
  * @param {string} children, number of children i.e. 1,2
  * @example {@_getRoomDescription occupancyType="TWIN" adults="1" children="1" /} output TWIN11
  */
  dust.helpers._getComposition = function(chunk, context, bodies, params) {
    params = params || {};
    var adults = params.adults;
    var children = params.children;
    var infants = params.infants;

    if (!adults) return false;

    var composition = adults + ' ' + pluralise('Adult', adults);

    if (children > 0) {
      composition += infants > 0 ? ',' : ' and';
      composition += ' ' + children + ' ' + pluralise('Child', children);
    }
    if (infants > 0) {
      composition += ', ' + infants + ' ' + pluralise('Infant', infants);
    }

    // Generate party description
    return chunk.write(composition);
  };
};
