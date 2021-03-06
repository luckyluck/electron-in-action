const { app, BrowserWindow, ipcMain } = require('electron');
const {
  createWindow,
  getFileFromUser,
  openFile,
  saveHtml,
  saveMarkdown,
  createContextMenu,
} = require('./utils');
const createApplicationMenu = require('./application-menu');

app.on('ready', () => {
  createApplicationMenu();
  createWindow();

  ipcMain.on('open-file', (e, filePath) => {
    // Sending path on drag-n-drop
    if (filePath) {
      openFile(
        BrowserWindow.fromWebContents(e.sender),
        filePath
      );
    } else {
      getFileFromUser(BrowserWindow.getFocusedWindow());
    }
  });

  ipcMain.on('new-file', () => {
    createWindow();
  });

  ipcMain.on('file-update', (e, title, isEdited) => {
    BrowserWindow.fromWebContents(e.sender).setTitle(title);
    BrowserWindow.fromWebContents(e.sender).setDocumentEdited(isEdited);
  });

  ipcMain.on('save-html', (_, content) => {
    saveHtml(BrowserWindow.getFocusedWindow(), content);
  });

  ipcMain.on('save-markdown', (_, file, content) => {
    saveMarkdown(BrowserWindow.getFocusedWindow(), file, content);
  });

  ipcMain.on('show-context-menu', (e, filePath) => {
    createContextMenu(e, filePath).popup();
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
