'use strict';

module.exports = function(dust) {

  /*
  * @description Capitalize the first letter of a word
  * @param word is the word you want to manipulate
  * @example {@_upcaseFirst word="home" /} output Home
  */

  dust.helpers._upcaseFirst = function(chunk, context, bodies, params) {
    params = params || {};
    var word = dust.helpers.tap(params.word, chunk, context);

    var newWord = word.slice(0, 1).toUpperCase() + word.slice(1);

    return chunk.write(newWord);
  };

};