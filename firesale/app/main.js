const { app, BrowserWindow, ipcMain } = require('electron');

const {
  createWindow,
  getFileFromUser,
  openFile,
  saveHtml,
  saveMarkdown,
} = require('./utils');

app.on('ready', () => {
  createWindow();

  ipcMain.on('open-file', () => {
    getFileFromUser(BrowserWindow.getFocusedWindow());
  });

  ipcMain.on('new-file', () => {
    createWindow();
  });

  ipcMain.on('file-update', (_, title, isEdited) => {
    BrowserWindow.getFocusedWindow().setTitle(title);
    BrowserWindow.getFocusedWindow().setDocumentEdited(isEdited);
  });

  ipcMain.on('save-html', (_, content) => {
    saveHtml(BrowserWindow.getFocusedWindow(), content);
  });

  ipcMain.on('save-markdown', (_, file, content) => {
    saveMarkdown(BrowserWindow.getFocusedWindow(), file, content);
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

app.on('will-finish-launching', () => {
  app.on('open-file', (event, file) => {
    const win = createWindow();

    win.once('ready-to-show', () => {
      openFile(win, file);
    });
  });
});
