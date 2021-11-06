const { app, BrowserWindow } = require('electron');
const { URL } = require('url');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';
let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 300,
    height: 600,
    minWidth: 300,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  let indexPath;

  if (isDev && !process.argv.includes('--noDevServer')) {
    indexPath = new URL('http://localhost:8080/index.html').href;
  } else {
    indexPath = new URL(`file://${path.join(__dirname, '..', 'dist', 'index.html')}`)
      .href;
  }

  mainWindow.loadURL(indexPath);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
});

app.allowRendererProcessReuse = true;
