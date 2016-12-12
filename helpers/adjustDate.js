'use strict';

var moment = require('moment');

module.exports = function(dust) {

/*
  * @description Calculate a customer's check-out date based on their check-in date and the amount of nights they have booked
  * @param {string} date - start date
  * @param {string} add - number of units to add
  * @param {string} subtract - number of units to subtract
  * @param {string} [unit=days] the measurement of time to add to
  * @param {string} format - the moment format string for the return
  * @example {@_adjustDate date="07/01/2015" add="3" unit="days" /} output "10/01/2015"
  */

  dust.helpers._adjustDate = function(chunk, context, bodies, params) {
    if (!params) {
      return NaN;
    }
    if ((params.add && params.add < 0) || (params.subtract && params.subtract < 0)) {
      return 'Negative numbers are not allowed.';
    }
    params = params || {};
    var date = moment.utc(dust.helpers.tap(params.date, chunk, context));
    var add = dust.helpers.tap(params.add, chunk, context);
    var subtract = dust.helpers.tap(params.subtract, chunk, context);
    var unit = dust.helpers.tap(params.unit, chunk, context) || 'days';
    if (add) {
      date = date.add(add, unit);
    }
    if (subtract) {
      date = date.subtract(subtract, unit);
    }
    var format = dust.helpers.tap(params.format, chunk, context);
    return chunk.write(date.format(format));
  };
};
