const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');

const windows = new Set();

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
    windows.delete(newWindow);
    newWindow = null;
  });

  windows.add(newWindow);
  return newWindow;
};

const openFile = (targetWindow, file) => {
  const content = fs.readFileSync(file).toString();

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

module.exports = {
  createWindow,
  getFileFromUser,
  openFile,
}
