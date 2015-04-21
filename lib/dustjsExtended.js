/* jslint node: true */
'use strict';

/*
* @name /lib/dustjsExtended.js
* @description Extend dustjs-helpers with our own helpers.  This file bootstraps all functions in the `helpers` directory.
* @since Sat Sep 13 2014
* @author Kevin Hodges <kevin.hodges@holidayextras.com>
*/

var fs = require( 'fs' );
var path = require( 'path' );

( function( dust ) {

	// build the path to our helpers and require them all
	var helpersDirectory = path.join( __dirname, '../helpers' );
	var files = fs.readdirSync( helpersDirectory );
	files.forEach( function( file ) {
		var filepath = path.join( helpersDirectory, file );
		if( fs.statSync( filepath ).isFile() ) {
			require( filepath )( dust );
		}
	} );

	// expose dust with our extensions
	module.exports = dust;

} )( require( 'dustjs-helpers' ) );