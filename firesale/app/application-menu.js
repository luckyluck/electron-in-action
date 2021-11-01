const { app, BrowserWindow, Menu, shell } = require('electron');

const macOSAppMenu = [{
  label: app.getName(),
  submenu: [
    {
      label: `About ${app.getName()}`,
      role: 'about',
    },
    { type: 'separator' },
    {
      label: 'Services',
      role: 'services',
      submenu: [],
    },
    { type: 'separator' },
    {
      label: `Hide ${app.getName()}`,
      accelerator: 'Command+H',
      role: 'hide',
    },
    {
      label: 'Hide Others',
      accelerator: 'Command+Alt+H',
      role: 'hideOthers',
    },
    {
      label: 'Show All',
      role: 'unhide',
    },
    { type: 'separator' },
    {
      label: `Quit ${app.getName()}`,
      accelerator: 'Command+Q',
      click() { app.quit(); },
    }
  ],
}];
const template = [
  ...(process.platform === 'darwin' ? macOSAppMenu : []),
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CommandOrControl+Z',
        role: 'undo',
      },
      {
        label: 'Redo',
        accelerator: 'Shirt+CommandOrControl+Z',
        role: 'redo',
      },
      { type: 'separator' },
      {
        label: 'Cut',
        accelerator: 'CommandOrControl+X',
        role: 'cut',
      },
      {
        label: 'Copy',
        accelerator: 'CommandOrControl+C',
        role: 'Copy',
      },
      {
        label: 'Paste',
        accelerator: 'CommandOrControl+V',
        role: 'Paste',
      },
      {
        label: 'Select All',
        accelerator: 'CommandOrControl+A',
        role: 'selectall',
      }
    ],
  },
  {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CommandOrControl+M',
        role: 'minimize',
      },
      {
        label: 'Close',
        accelerator: 'CommandOrControl+W',
        role: 'close',
      },
      { type: 'separator' },
      {
        label: 'Bring All to Front',
        role: 'front',
      },
    ],
  },
  {
    label: 'Help',
    role: 'help',
    submenu: [
      {
        label: 'Visit Website',
        click() { console.log('To be implemented'); },
      },
      {
        label: 'Toggle Developer Tools',
        click(_, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools();
        },
      }
    ],
  }
];

module.exports = Menu.buildFromTemplate(template);
