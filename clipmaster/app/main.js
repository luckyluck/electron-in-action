const path = require('path');
const { app, Menu, Tray } = require('electron');
const { getIcon } = require('./utils');

const clippings = [];
let tray = null;

const updateMenu = () => {
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Create New Clipping',
      click() { console.log('create new...'); },
    },
    { type: 'separator' },
    ...clippings.map(clipping => ({ label: clipping })),
    {
      label: 'Quit',
      click() { app.quit(); },
    }
  ]));
};

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

  updateMenu();

  tray.setToolTip('Clipmaster');
});
