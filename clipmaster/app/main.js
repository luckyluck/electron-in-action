const path = require('path');
const { app, Menu, Tray } = require('electron');
const { getIcon } = require('./utils');

let tray = null;

app.whenReady().then(() => {
  // Hide the dock icon on macOS
  if (app.dock) {
    app.dock.hide();
  }

  tray = new Tray(path.join(__dirname, getIcon()));

  // TODO might be an outdated tweak
  if (process.platform === 'win32') {
    tray.on('click', tray.popUpContextMenu);
  }

  const menu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      click() { app.quit(); },
    }
  ]);

  tray.setToolTip('Clipmaster');
  tray.setContextMenu(menu);
});
