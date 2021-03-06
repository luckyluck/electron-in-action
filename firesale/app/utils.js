const { app, BrowserWindow, dialog, Menu } = require('electron');
const fs = require('fs');
const path = require('path');
const createApplicationMenu = require('./application-menu');

const windows = new Set();
const openFiles = new Map();

const getNewWindowPosition = () => {
  const currentWindow = BrowserWindow.getFocusedWindow();
  let x, y;

  if (currentWindow) {
    const [ currentWindowX, currentWindowY ] = currentWindow.getPosition();
    x = currentWindowX + 10;
    y = currentWindowY + 10;
  }

  return [x, y];
};

const createWindow = () => {
  const [x, y] = getNewWindowPosition();
  let newWindow = new BrowserWindow({
    x,
    y,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  newWindow.loadFile('./src/index.html');

  newWindow.on('ready-to-show', () => {
    newWindow.show();
  });

  newWindow.on('focus', createApplicationMenu);

  newWindow.on('close', async e => {
    if (newWindow.isDocumentEdited()) {
      e.preventDefault();

      const { response } = await dialog.showMessageBox(newWindow, {
        type: 'warning',
        title: 'Quit with Unsaved Changes?',
        message: 'Your changes will be lost if you do not save.',
        buttons: ['Quit Anyway', 'Cancel'],
        defaultId: 0,
        cancelId: 1,
      });

      if (response === 0) {
        newWindow.destroy();
      }
    }
  });

  newWindow.on('closed', () => {
    windows.delete(newWindow);
    createApplicationMenu();
    stopWatchingFile(newWindow);
    newWindow = null;
  });

  windows.add(newWindow);
  return newWindow;
};

const openFile = async (targetWindow, file) => {
  if (targetWindow.isDocumentEdited()) {
    const { response } = await dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
      type: 'warning',
      title: 'Overwrite Current Unsaved Changes?',
      message: 'Opening a new file in this window will overwrite your unsaved changes. Open this file anyway?',
      buttons: ['Yes', 'Cancel'],
      defaultId: 0,
      cancelId: 1,
    });

    if (response) return;
  }

  const content = fs.readFileSync(file).toString();

  startWatchingFile(targetWindow, file);

  app.addRecentDocument(file);
  targetWindow.setRepresentedFilename(file);
  targetWindow.webContents.send('file-opened', file, content);
  createApplicationMenu();
};

const getFileFromUser = async targetWindow => {
  const { canceled, filePaths } = await dialog.showOpenDialog(targetWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'Markdown Files', extensions: ['md', 'markdown'] },
    ],
  });

  if (canceled) return;

  openFile(targetWindow, filePaths[0]);
};

const saveHtml = async (targetWindow, content) => {
  const { canceled, filePath } = await dialog.showSaveDialog(targetWindow, {
    title: 'Save HTML',
    defaultPath: app.getPath('documents'),
    filters: [{
      name: 'HTML Files', extensions: ['html', 'htm'],
    }],
  });

  if (canceled) return;

  const validHTML = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>${path.basename(filePath)}</title>
    </head>
    <body>
        ${content}
    </body>
    </html>`;

  fs.writeFileSync(filePath, validHTML);
};

const saveMarkdown = async (targetWindow, file, content) => {
  if (!file) {
    const { canceled, filePath } = await dialog.showSaveDialog(targetWindow, {
      title: 'Save Markdown',
      defaultPath: app.getPath('documents'),
      filters: [{
        name: 'Markdown Files', extensions: ['md', 'markdown'],
      }],
    });

    if (canceled) return;

    file = filePath;
  }

  fs.writeFileSync(file, content);
  openFile(targetWindow, file);
};

const stopWatchingFile = targetWindow => {
  if (openFiles.has(targetWindow)) {
    openFiles.get(targetWindow).close();
    openFiles.delete(targetWindow);
  }
};

const startWatchingFile = (targetWindow, file) => {
  stopWatchingFile(targetWindow);

  const watcher = fs.watch(file, event => {
    if (event === 'change') {
      const content = fs.readFileSync(file).toString();
      targetWindow.webContents.send('file-changed', file, content);
    }
  });

  openFiles.set(targetWindow, watcher);
};

const createContextMenu = (e, filePath) => {
  return Menu.buildFromTemplate([
    {
      label: 'Open File',
      click() { getFileFromUser(BrowserWindow.fromWebContents(e.sender)); },
    },
    {
      label: 'Show File in Folder',
      click() {
        BrowserWindow.fromWebContents(e.sender).webContents.send('show-file');
      },
      enabled: !!filePath,
    },
    {
      label: 'Open in Default Editor',
      click() {
        BrowserWindow.fromWebContents(e.sender).webContents.send('open-in-default');
      },
      enabled: !!filePath,
    },
    { type: 'separator' },
    { label: 'Cut', role: 'cut' },
    { label: 'Copy', role: 'copy' },
    { label: 'Paste', role: 'paste' },
    { label: 'Select All', role: 'selectall' },
  ]);
};

module.exports = {
  createWindow,
  getFileFromUser,
  openFile,
  saveHtml,
  saveMarkdown,
  createContextMenu,
}
