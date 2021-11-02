const { app, dialog, Menu } = require('electron');
const { createWindow, getFileFromUser } = require('./utils');

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
    label: 'File',
    submenu: [
      {
        label: 'New File',
        accelerator: 'CommandOrControl+N',
        click() {
          createWindow();
        }
      },
      {
        label: 'Open File',
        accelerator: 'CommandOrControl+O',
        click(_, focusedWindow) {
          if (focusedWindow) {
            return getFileFromUser(focusedWindow);
          }

          const newWindow = createWindow();

          newWindow.on('show', () => {
            getFileFromUser(newWindow);
          });
        }
      },
      {
        label: 'Save File',
        accelerator: 'CommandOrControl+S',
        click(_, focusedWindow) {
          if (!focusedWindow) {
            return dialog.showErrorBox(
              'Cannot Save or Export',
              'There is currently no active document to save or export'
            );
          }

          focusedWindow.webContents.send('save-markdown');
        }
      },
      {
        label: 'Export HTML',
        accelerator: 'Shirt+CommandOrControl+S',
        click(_, focusedWindow) {
          if (!focusedWindow) {
            return dialog.showErrorBox(
              'Cannot Save or Export',
              'There is currently no active document to save or export'
            );
          }

          focusedWindow.webContents.send('save-html');
        }
      },
      { type: 'separator' },
      {
        label: 'Save File',
        accelerator: 'Shirt+CommandOrControl+S',
        click(item, focusedWindow) {
          if (!focusedWindow) {
            return dialog.showErrorBox(
              'Cannot Show File\'s Location',
              'There is currently no active document show.'
            );
          }

          focusedWindow.webContents.send('show-file');
        },
      },
      {
        label: 'Open in Default Editor',
        accelerator: 'Shirt+CommandOrControl+O',
        click(item, focusedWindow) {
          if (!focusedWindow) {
            return dialog.showErrorBox(
              'Cannot Open File in Default Editor',
              'There is currently no active document show.'
            );
          }

          focusedWindow.webContents.send('open-in-default');
        },
      },
    ],
  },
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
