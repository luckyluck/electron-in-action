const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const {
  createWindow,
  getFileFromUser,
  openFile,
  saveHtml,
  saveMarkdown,
  getWindowById,
} = require('./utils');
const applicationMenu = require('./application-menu');

app.on('ready', () => {
  Menu.setApplicationMenu(applicationMenu);
  createWindow();

  ipcMain.on('open-file', (e, filePath) => {
    // Sending path on drag-n-drop
    if (filePath) {
      openFile(
        BrowserWindow.getFocusedWindow() ?? getWindowById(e.sender.id),
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
    // Somehow in the case of drag-n-drop current window loses focus
    // And we have to iterate the list of all windows to find channel-caller
    const activeWindow = BrowserWindow.getFocusedWindow() ?? getWindowById(e.sender.id);
    activeWindow.setTitle(title);
    activeWindow.setDocumentEdited(isEdited);
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
