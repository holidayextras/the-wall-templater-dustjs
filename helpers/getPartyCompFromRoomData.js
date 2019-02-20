'use strict'

var _ = require('lodash')
var pluralise = require('../lib/pluralise')

module.exports = function (dust) {
  /*
  * @description Get the combined party composition of all the rooms
  */
  dust.helpers._getPartyCompFromRoomData = function (chunk, context, bodies, params) {
    params = params || {}
    var adults = 0
    var children = 0
    _.forEach(params.rooms, function (room) {
      adults += room.adults
      children += room.children + room.infants
    })
    if (!adults) return false
    var composition = adults + ' ' + pluralise('Adult', adults)
    if (children > 0) {
      composition += ' and ' + children + ' ' + pluralise('Child', children)
    }
    return chunk.write(composition)
  }
}
