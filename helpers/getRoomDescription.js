'use strict';

var _ = require('lodash');
var roomTypes = require( '../lib/roomTypes' );

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

  dust.helpers._getRoomDescription = function(chunk, context, bodies, params) {
    var roomCode = params.occupancytype + params.adults + params.children;
    return chunk.write(_.get(roomTypes, [roomCode, 'roomDescription'], 'Description Not Found'));
  };
};
