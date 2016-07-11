'use strict';

var expect = require('chai').expect;

var dustMock;
var chunkMock;

describe('Uppercase first letter - Dust helpers', function() {

  before(function(done) {
    var returnEasy = function(value) {
      return value;
    };

    dustMock = {
      helpers: {
        tap: function(valueToSearch) {
          return valueToSearch || null;
        }
      }
    };

    chunkMock = {
      write: function(value) {
        return value;
      }
    };

    context = {
      push: returnEasy
    };

    require('../helpers/upcaseFirst.js')(dustMock);
    done();
  });

  it('should return Home from home', function() {
    var params = {
      word: 'home'
    };

    expect(dustMock.helpers._upcaseFirst(chunkMock, context, null, params)).to.equal('Home');
  });

});
