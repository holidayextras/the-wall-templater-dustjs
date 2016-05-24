'use strict';

var _ = require('lodash');

module.exports = function(dust) {

  /*
  * @description Extend dustjs with a date differential helper courtesy of momentjs
  * @param {string} toLoop
  * @example {@_forEach toLoop=Object|Array|String /} output 3
  */

  dust.helpers._forEach = function(chunk, context, bodies, params) {
    params = params || {};
    _.forEach(params.toLoop, function(currentLoop) {
      chunk = chunk.render(bodies.block, context.push(currentLoop));
    });
    return chunk;
  };

};
