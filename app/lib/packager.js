'use strict';

let packager      = require( 'electron-packager' );
let tmp           = require( 'tmp' );
let template      = require( 'lodash.template' );
let fs            = require( 'fs' );
let patchFs       = require( 'electron-patch-fs' );
let child_process = require( 'child_process' );

const OPTIONS = {
  version  : '0.36.2',
  arch     : process.arch,
  platform : process.platform
};

const FILES = [
  `${__dirname}/../../templates/index.js`,
  `${__dirname}/../../templates/package.json`,
  `${__dirname}/../../templates/storage.js`,
];

function init( options ) {
  options = Object.assign( OPTIONS, options )

  let promise = new Promise( function( resolve, reject ) {
    tmp.dir( { unsafeCleanup : true }, function( error, tmpPath, cleanupCallback ) {
      if ( error ) {
        return reject( error );
      }


      options.dir = tmpPath;
      options.out = `${tmpPath}/dist`;
      options.icon = `${__dirname}/../../alice.icns`;

      FILES.forEach( ( file ) => {
        try {
          let fileContent = template(
            fs.readFileSync( file, 'utf8' )
          )( {
              url  : options.url,
              name : options.name
            }
          );

          fs.writeFileSync(
            `${ tmpPath }/${ file.split( '/' ).pop() }`,
            fileContent
          );
        } catch( error ) {
          return reject( error );
        }
      } );

      patchFs.patch();

      console.log( 'running npm install' );

      child_process.spawnSync( 'npm', [ 'i' ], { cwd : options.dir } );

      console.log( options.dir );

      packager( options, function( error, appPath ) {

        if ( error ) {
          return reject( error );
        }

        resolve( appPath );

        patchFs.unpatch();

        // cleanupCallback();
      } );
    } );
  } );

  return promise;
}

module.exports = {
  init : init
};
