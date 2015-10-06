/* jslint node: true */
'use strict';

module.exports = function( dust ) {

  /*
  * @description Extend dustjs so we can load templates with a namespace.
  * @param {string} name template name
  * @param {string} namespace path of the template
  * @example {@_loadTemplate name="test" namespace="/templates" /} output template content
  */

  dust.helpers._loadTemplate = function( chunk, context, bodies, params ) {
    var name = dust.helpers.tap( params.name, chunk, context );
    var namespace = dust.helpers.tap( params.namespace, chunk, context );
    var filePath = namespace + name;

    // If we have the partial in the cache then render
    // else just fall back to basics
    return dust.cache[filePath] ? chunk.partial( namespace + name, context ) : chunk;
  };
};
