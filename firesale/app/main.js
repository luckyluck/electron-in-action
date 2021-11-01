const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const {
  createWindow,
  getFileFromUser,
  openFile,
  saveHtml,
  saveMarkdown,
} = require('./utils');
const applicationMenu = require('./application-menu');

app.on('ready', () => {
  Menu.setApplicationMenu(applicationMenu);
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

  ipcMain.on('show-context-menu', e => {
    const markdownContextMenu = Menu.buildFromTemplate([
      {
        label: 'Open File',
        click() { getFileFromUser(BrowserWindow.fromWebContents(e.sender)); },
      },
      { type: 'separator' },
      { label: 'Cut', role: 'cut' },
      { label: 'Copy', role: 'copy' },
      { label: 'Paste', role: 'paste' },
      { label: 'Select All', role: 'selectall' },
    ]);

    markdownContextMenu.popup();
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
