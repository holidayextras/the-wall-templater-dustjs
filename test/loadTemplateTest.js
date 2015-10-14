// /* jslint node: true */
// 'use strict';

// var chai = require( 'chai' );
// var chaiAsPromised = require( 'chai-as-promised' );
// chai.use( chaiAsPromised );
// chai.should();

// var dustMock;
// var chunkMock;
// var context;

// describe( 'Load template - Dust helpers', function() {

//   before( function( done ) {
//     var returnEasy = function( value ) {
//       return value;
//     };
//     dustMock = {
//       helpers: {
//         tap: function( valueToSearch ) {
//           return valueToSearch || null;
//         }
//       },
//       cache: {
//         '/templates/test': true
//       }
//     };

//     chunkMock = {
//       partial: function( value ) {
//         return value;
//       }
//     };

//     context = {
//       push: returnEasy,
//       stack: {
//         head: 'headTest'
//       }
//     };


//     require( '../helpers/loadTemplate.js' )( dustMock );
//     done();
//   } );

//   it( 'should return "/templates/test" from "/templates/" and "test"', function( done ) {
//     var params = {
//       name: 'test',
//       namespace: '/templates/',
//       foo: 'bar'
//     };

//     dustMock.helpers._loadTemplate( chunkMock, context, null, params ).should.be.equal( '/templates/test' );
//     done();
//   } );

//   it( 'should return "Cannot read property \'name\' of null" when no params are passed', function( done ) {
//     try {
//       var params = null;
//       dustMock.helpers._loadTemplate( chunkMock, 'test', null, params );
//     } catch( error ) {
//       console.log( error.message );
//       error.message.should.equal( 'Cannot read property \'name\' of null' );
//     }
//     done();
//   } );

// } );
