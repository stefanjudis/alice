;( function() {
  'use strict';

  let form     = document.getElementById( 'form' );
  let packager = require( './lib/packager' );

  form.addEventListener( 'submit', event => {
    event.preventDefault();

    packager.init( {
      name : form.name.value,
      url  : form.url.value,
      out  : 'dist'
    } ).then( function( app ) {
      alert( app );
    } ).catch( function( error ) {
      alert( error );
    } );
  } );
} )();
