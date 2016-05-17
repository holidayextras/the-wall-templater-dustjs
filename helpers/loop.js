'use strict';

module.exports = function(dust) {

  /*
  * @description Extend dustjs with a loop helper
  * Kudos to rragan on https://github.com/linkedin/dustjs-helpers/issues/99
  * @example {@_loop from=1 to="{end}"}This is iteration {.}{/_loop}
  * @example {@_loop from=10 to=0}Countdown T-{.}{/_loop}
  */

  dust.helpers._loop = function(chunk, context, bodies, params) {
    // Make sure that the int is a number, otherwise fall back to 1
    var from = parseInt(dust.helpers.tap(params.from, chunk, context), 10) || 0;
    var to = parseInt(dust.helpers.tap(params.to, chunk, context), 10) || 0;

    var len = Math.abs(to - from) + 1;
    var increment = (to - from) / (len - 1) || 1;

    while (from !== to) {
      chunk = bodies.block(chunk, context.push(from, from, len));
      from += increment;
    }

    return chunk.render(bodies.block, context.push(from, from, len));
  };
};
