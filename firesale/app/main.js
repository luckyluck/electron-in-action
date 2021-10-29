const { app, BrowserWindow, ipcMain } = require('electron');

const { createWindow, getFileFromUser } = require('./utils');

app.on('ready', () => {
  createWindow();

  ipcMain.handle('open-file', async () => {
    return getFileFromUser(BrowserWindow.getFocusedWindow());
  });

  ipcMain.on('new-file', () => {
    createWindow();
  });

  ipcMain.on('file-update', (_, title, isEdited) => {
    BrowserWindow.getFocusedWindow().setTitle(title);
    BrowserWindow.getFocusedWindow().setDocumentEdited(isEdited);
  });
});

app.on('activate', (_, hasVisibleWindows) => {
  if (!hasVisibleWindows) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform === 'darwin') {
    return false;
  }

  app.quit();
});
