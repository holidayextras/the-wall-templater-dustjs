'use strict';

var _ = require('lodash');
var path = require('path');
var Q = require('q');
var fs = require('q-io/fs');
var expect = require('chai')
  .use(require('chai-as-promised'))
  .expect;

var Templater = require('../lib/templater.js');

var templater = null;
var testFiles = {};

var filesRequired = {
  test: path.join(__dirname, '/fixtures/wallTemplater/templates/test.tpl'),
  partial: path.join(__dirname, '/fixtures/wallTemplater/templates/partial.tpl'),
  syntaxError: path.join(__dirname, '/fixtures/wallTemplater/templates/syntaxError.tpl')
};

// FooData is special.. is a json object so load it as such.
testFiles.fooData = require(path.join(__dirname, '/fixtures/foo.json'));

// This functionality is called before any tests run.
beforeEach(function(done) {

  // Start up a new templater instance to run our tests on.
  templater = new Templater({
    namespace: ''
  });

  _.each(filesRequired, function(value, key) {
    fs.read(value).then(function(contents) {
      testFiles[key] = contents;
    });
  });

  // Load all the files we require for the tests.
  Q.all(testFiles).then(function() {
    // Cool, all files loaded so let's move on to the tests ;)
    done();
  });
});


describe('Wall Templater', function() {

  it('should expose as an object', function(done) {
    expect(templater).to.be.an('object');
    done();
  });

  it('should fail on invalid key in the schema', function(done) {

    try {
      templater = new Templater({
        namespace: '',
        newKey: 'this key should fail, because it is not allowed'
      });
    } catch (error) {
      expect(error.message).to.equal('ValidationError: newKey is not allowed');
      done();
    }

  });

  describe('#compile', function() {

    it('should fulfill a promise when successful', function() {
      return expect(templater.compile({
        identifier: path.join(__dirname, '/fixtures/wallTemplater/templates/test.tpl'),
        content: testFiles.test
      })).to.be.fulfilled;
    });

    it('should reject a promise when failure occurs', function() {
      return expect(templater.compile({
        identifier: path.join(__dirname, '/fixtures/wallTemplater/templates/noFileHere.tpl'),
        content: testFiles.noFileHere
      })).to.be.rejected;
    });

    it('should reject a promise when syntax error is found', function() {
      return expect(templater.compile({
        identifier: path.join(__dirname, '/fixtures/wallTemplater/templates/syntaxError.tpl'),
        content: testFiles.syntaxError
      })).to.be.rejected;
    });
  });

  describe('#render', function() {

    it('should reject a promise if missing partial', function() {
      // Note, no partial loaded before here
      return expect(templater.render({
        template: 'test',
        data: testFiles.fooData
      })).to.be.rejected;
    });

    it('should fulfill a promise when successful', function() {

      // Load a partial then render template
      return templater.compile({
        identifier: 'partial',
        content: testFiles.partial
      }).then(function() {
        return templater.compile({
          identifier: 'test',
          content: testFiles.test
        }).then(function() {
          return expect(templater.render({
            template: 'test',
            data: testFiles.fooData
          })).to.be.fulfilled;
        });
      });
    });

    it('should populate the template with data', function() {

      // Load a partial then render template
      return templater.compile({
        identifier: path.join(__dirname, '/fixtures/wallTemplater/templates/partial.tpl'),
        content: testFiles.partial
      }).then(function() {
        return expect(templater.render({
          template: 'test',
          data: testFiles.fooData
        })).to.become('this is foo in an outer template and a partial');
      });
    });

    it('should reject a promise when syntax error occurs', function() {

      // Load a partial then render template
      return templater.compile({
        identifier: path.join(__dirname, '/fixtures/wallTemplater/templates/partial.tpl'),
        content: testFiles.partial
      }).then(function() {
        return expect(templater.render({
          template: 'syntaxError',
          data: testFiles.fooData
        })).to.be.rejected;
      });
    });
  });
});
