'use strict'

var fs = require('fs')
var path = require('path');

(function (dust) {
  // build the path to our helpers and require them all
  var helpersDirectory = path.join(__dirname, '../helpers')
  var files = fs.readdirSync(helpersDirectory)
  files.forEach(function (file) {
    var filepath = path.join(helpersDirectory, file)
    if (fs.statSync(filepath).isFile()) {
      require(filepath)(dust)
    }
  })

  // expose dust with our extensions
  module.exports = dust
})(require('dustjs-helpers'))
