const electron      = require( 'electron' );
const app           = electron.app;
const BrowserWindow = electron.BrowserWindow;

electron.crashReporter.start();

var mainWindow = null;

app.on( 'window-all-closed', function() {
  app.quit();
} );

app.on( 'ready', function()  {
  mainWindow = new BrowserWindow( {
    width      : 1200,
    height     : 800,
    fullscreen : false,
    titleBarStyle : 'hidden',
    resizable : false
  } );

  mainWindow.openDevTools();

  mainWindow.loadURL( 'file://' + __dirname + '/app/index.html' );

  mainWindow.on( 'closed', function() {
    mainWindow = null;
  } );
} );
