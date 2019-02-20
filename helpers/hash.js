'use strict'
var crypto = require('crypto')
module.exports = function (dust) {
  /*
  * @description Extend dustjs with a hash helper (using SHA1)
  * @param {string} value the value you want hashed
  * @example {@_hash value="foobar" /} output 8843d7f92416211de9ebb963ff4ce28125932878
  */

  dust.helpers._hash = function (chunk, context, bodies, params) {
    params = params || {}
    var shasum = crypto.createHash('sha1')
    shasum.update(params.value)
    return chunk.write(shasum.digest('hex'))
  }
}
