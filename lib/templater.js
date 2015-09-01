/* jslint node: true */
'use strict';

var _ = require( 'lodash' );
var Q = require( 'q' );
var dust = require( './dustjsExtended' );
var Joi = require( 'joi' );

function Templater( options ) {

  var self = this;

  // Maybe merge in some defaults here?
  self.settings = _.merge( {
    namespace: ''
  }, options );

  var schema = Joi.object().keys( {
    namespace: Joi.any().optional()
  } );

  Joi.validate( self.settings, schema, function( err ) {
    if ( err ) {
      throw new Error( err );
    }
  } );

  self.compile = function( options2 ) {
    var deferred = Q.defer();
    try {
      var compiled = dust.compile( options2.content, self.settings.namespace + options2.identifier );
      dust.loadSource( compiled );
      deferred.resolve();
    } catch ( e ) {
      deferred.reject( e.message );
    }
    return deferred.promise;
  };

  self.render = function( options2 ) {
    var deferred = Q.defer();

    // Passing the template namespace to the template variable scope
    options2.data.templateNamespace = self.settings.namespace;

    // Render the template
    dust.render( self.settings.namespace + options2.template, options2.data, function( err, out ) {
      if ( err ) {
        deferred.reject( err );
      } else {
        deferred.resolve( out );
      }
    } );
    return deferred.promise;
  };

}

module.exports = exports = Templater;
