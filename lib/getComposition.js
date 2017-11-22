'use strict';

var pluralise = require('./pluralise');

function getComposition(partyCompCounts) {
  partyCompCounts = partyCompCounts || {};
  var adults = partyCompCounts.adults;
  var children = partyCompCounts.children;
  var infants = partyCompCounts.infants;

  if (!adults) {
    return null;
  }
  var composition = adults + ' ' + pluralise('Adult', adults);
  if (children > 0) {
    composition += (', ' + children + ' ' + pluralise('Child', children));
  }
  if (infants > 0) {
    composition += (', ' + infants + ' ' + pluralise('Infant', infants));
  }
  return composition;
}

module.exports = exports = getComposition;