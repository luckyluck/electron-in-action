const { menubar } = require('menubar');

const mb = menubar({
  dir: 'app',
});

mb.on('ready', () => {
  console.log('Application is ready.');
});
