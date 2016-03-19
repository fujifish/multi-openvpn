var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var Menu = require('menu');
var Tray = require('tray');
var util = require('util');

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;
var appIcon = null;

app.commandLine.appendSwitch('ignore-certificate-errors');

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // if (process.platform != 'darwin')
  app.quit();
});

function createWindow() {
  // Create the browser window.
  window = new BrowserWindow({
    width: 360,
    height: 520,
    resizable: true,
    title: 'Multi OpenVPN'
  });

  window.maximize();

  // window.webContents.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.76 Safari/537.36');
  window.loadUrl('file://'+__dirname + '/main.html');

  // Emitted when the window is closed.
  window.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    window = null;
  });
}

function setupTray() {
  // appIcon = new Tray(__dirname+'/gmail-icon-default.png');
  // appIcon.setToolTip('No unread messages');
  var trayContextMenu = Menu.buildFromTemplate([
    {
      label: 'New Connection',
      click: function() { createWindow(); }
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      click: function() { app.quit(); }
    },
  ]);
  appIcon.setContextMenu(trayContextMenu);
}

function setupMenu() {
  var template = [
    {
      label: 'Multi OpenVPN',
      submenu: [
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function() { app.quit(); }
        },
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Copy',
          accelerator: 'Command+C',
          selector: 'copy:'
        },
        {
          label: 'Paste',
          accelerator: 'Command+V',
          selector: 'paste:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Undo',
          accelerator: 'Command+Z',
          selector: 'undo:'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+Command+Z',
          selector: 'redo:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: function() { BrowserWindow.getFocusedWindow().reloadIgnoringCache(); }
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'Alt+Command+I',
          click: function() { BrowserWindow.getFocusedWindow().toggleDevTools(); }
        },
      ]
    },
  ];

  menu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(menu); // Must be called within app.on('ready', function(){ ... });
}

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {

  var ipc = require('ipc');
  ipc.on('add-openvpn', function(event, args) {
    createWindow();
  });

  createWindow();

  //setupTray();

  setupMenu();

});
