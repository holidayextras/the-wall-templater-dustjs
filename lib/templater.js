'use strict';

var _ = require('lodash');
var Q = require('q');
var dust = require('./dustjsExtended');
var Joi = require('joi');

function Templater(options) {

  var self = this;

  // Maybe merge in some defaults here?
  self.settings = _.merge({
    namespace: ''
  }, options);

  var schema = Joi.object().keys({
    namespace: Joi.any().optional()
  });

  Joi.validate(self.settings, schema, function(error) {
    if (error) {
      throw new Error(error);
    }
  });

  self.compile = function(compileOptions) {
    var deferred = Q.defer();
    try {
      var compiled = dust.compile(compileOptions.content, self.settings.namespace + compileOptions.identifier);
      dust.loadSource(compiled);
      deferred.resolve();
    } catch (error) {
      console.error(error.message);
      deferred.reject(error.message);
    }
    return deferred.promise;
  };

  self.render = function(renderOptions) {
    var deferred = Q.defer();

    // Passing the template namespace to the template variable scope
    renderOptions.data.templateNamespace = self.settings.namespace;

    // Render the template
    dust.render(self.settings.namespace + renderOptions.template, renderOptions.data, function(error, out) {
      if (error) {
        deferred.reject(error);
      } else {
        deferred.resolve(out);
      }
    });
    return deferred.promise;
  };

}
module.exports = exports = Templater;
