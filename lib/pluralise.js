/* eslint indent: ["error", 2, { "SwitchCase": 1 }] */
'use strict';

/**
 * Turns a singular version of a word into the plural
 * @param  {String} word singular word
 * @param  {Number} quantity number of the item
 * @return {String} The word pluralised to match the number
 */
function pluralise(word, quantity) {
  if (quantity === 1) return word;
  switch (word.toLowerCase()) {
    case 'child':
      return 'children';
    case 'baby':
      return 'babies';
    default:
      return word + 's';
  }
}

module.exports = exports = pluralise;
