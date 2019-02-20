'use strict';

var _ = require('lodash');
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
    return new Promise((resolve, reject) => {
      try {
        var compiled = dust.compile(compileOptions.content, self.settings.namespace + compileOptions.identifier);
        dust.loadSource(compiled);
        resolve();
      } catch (error) {
        console.error(error.message);
        reject(error.message);
      }
    });
  };

  self.render = function(renderOptions) {
    return new Promise((resolve, reject) => {
      // Passing the template namespace to the template variable scope
      renderOptions.data.templateNamespace = self.settings.namespace;

      // Render the template
      dust.render(self.settings.namespace + renderOptions.template, renderOptions.data, function(error, out) {
        if (error) {
          reject(error);
        } else {
          resolve(out);
        }
      });
    });
  };

}
module.exports = exports = Templater;
