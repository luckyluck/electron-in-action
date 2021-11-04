const { menubar } = require('menubar');

const mb = menubar({
  dir: 'app',
  browserWindow: {
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  },
});

mb.on('ready', () => {
  console.log('Application is ready.');
});
