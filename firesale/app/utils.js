const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

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

  newWindow.loadFile('./app/index.html');

  newWindow.on('ready-to-show', () => {
    newWindow.show();
  });

  newWindow.on('close', () => {
    if (newWindow.isDocumentEdited()) {
      // ...
    }
  });

  newWindow.on('closed', () => {
    windows.delete(newWindow);
    stopWatchingFile(newWindow);
    newWindow = null;
  });

  windows.add(newWindow);
  return newWindow;
};

const openFile = (targetWindow, file) => {
  const content = fs.readFileSync(file).toString();

  startWatchingFile(targetWindow, file);

  app.addRecentDocument(file);
  targetWindow.setRepresentedFilename(file);
  targetWindow.webContents.send('file-opened', file, content);
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

const getWindowById = id =>
  BrowserWindow.getAllWindows().find(window => window.id === id);

const stopWatchingFile = targetWindow => {
  if (openFiles.has(targetWindow)) {
    openFiles.get(targetWindow).stop();
    openFiles.delete(targetWindow);
  }
};

const startWatchingFile = (targetWindow, file) => {
  stopWatchingFile(targetWindow);

  const watcher = fs.watch(file, event => {
    if (event === 'change') {
      const content = fs.readFileSync(file).toString();
      targetWindow.webContents.send('file-opened', file, content);
    }
  });

  openFiles.set(targetWindow, watcher);
};

module.exports = {
  createWindow,
  getFileFromUser,
  openFile,
  saveHtml,
  saveMarkdown,
  getWindowById,
  startWatchingFile,
}
