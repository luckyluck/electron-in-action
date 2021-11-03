const path = require('path');
const { app, Menu, Tray, clipboard, globalShortcut } = require('electron');
const { getIcon, createClippingMenu } = require('./utils');

const clippings = [];
let tray = null;

const addClipping = () => {
  const clipping = clipboard.readText();

  if (clippings.includes(clipping)) return;

  clippings.unshift(clipping);
  updateMenu();
};

const updateMenu = () => {
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Create New Clipping',
      accelerator: 'CommandOrControl+Shift+C',
      click() { addClipping(); },
    },
    { type: 'separator' },
    ...clippings
      .slice(0, 10)
      .map((clipping, index) => createClippingMenu(clipping, index)),
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

  const activationShortcut = globalShortcut.register(
    'CommandOrControl+Option+C',
    () => { tray.popUpContextMenu(); }
  );

  if (!activationShortcut) {
    console.error('Global activation shortcut failed to register');
  }

  const newClippingShortcut = globalShortcut.register(
    'CommandOrControl+Shift+Option+C',
    () => { addClipping(); }
  );

  if (!newClippingShortcut) {
    console.error('Global new clipping shortcut failed to register');
  }

  updateMenu();

  tray.setToolTip('Clipmaster');
});
