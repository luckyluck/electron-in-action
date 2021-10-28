const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');

let mainWindow = null;

const getFileFromUser = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'Markdown Files', extensions: ['md', 'markdown'] },
    ],
  });

  if (canceled) return;

  const file = filePaths[0];
  const content = fs.readFileSync(file).toString();

  return { file, content };
};

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadFile('./app/index.html');

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  ipcMain.handle('open-file', async () => {
    return getFileFromUser();
  });

  mainWindow.on('close', () => {
    mainWindow = null;
  });
});
