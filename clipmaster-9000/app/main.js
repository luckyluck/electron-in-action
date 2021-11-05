const { globalShortcut, Menu } = require('electron');
const { menubar } = require('menubar');

const mb = menubar({
  dir: 'app',
  preloadWindow: true,
  browserWindow: {
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  },
});

const secondaryMenu = Menu.buildFromTemplate([
  {
    label: 'Quit',
    click() { mb.app.quit(); },
    accelerator: 'CmdOrCtrl+Q',
  }
]);

mb.on('ready', () => {
  console.log('Application is ready.');

  mb.tray.on('right-click', () => {
    mb.tray.popUpContextMenu(secondaryMenu);
  });

  const createClipping = globalShortcut.register(
    'CommandOrControl+!',
    () => mb.window.webContents.send('create-new-clipping')
  );
  const writeClipping = globalShortcut.register(
    'CmdOrCtrl+Alt+@',
    () => mb.window.webContents.send('write-to-clipboard')
  );
  const publishClipping = globalShortcut.register(
    'CmdOrCtrl+Alt+#',
    () => mb.window.webContents.send('publish-clipping')
  );

  if (!createClipping) {
    console.error('Registration failed', 'createClipping');
  }
  if (!writeClipping) {
    console.error('Registration failed', 'writeClipping');
  }
  if (!publishClipping) {
    console.error('Registration failed', 'publishClipping');
  }
});
