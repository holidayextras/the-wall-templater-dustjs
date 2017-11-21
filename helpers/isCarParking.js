'use strict';

module.exports = function(dust) {

 /*
  * @description Detect whether the upgrade type is car parking for conditional rendering in confirmation template
  * @param upgradeName is the name of the upgrade type which is used to check if it is car parking
  * @example {@_isCarParking upgradeName=content.name /} returns true if Car Parking otherwise false
  */

  dust.helpers._isCarParking = function(chunk, context, bodies, params) {
    // strip the whitespace and lowercase content.name just to be safe and return true or false appropriately
    if (typeof params !== 'undefined' && params.upgradeName) {
      return (params.upgradeName.toLowerCase().replace(/ /g, '') === 'carparking');
    }
    return false;
  };

};
