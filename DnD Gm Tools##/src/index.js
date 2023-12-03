const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const UserData = app.getPath('userData')
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    autoHideMenuBar : true,
    icon: path.join(__dirname, '..\\' , 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      devTools: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  ipcMain.on('askPath', ()=>{
    mainWindow.webContents.send('userData', UserData);
  })
};
const createSoundsWindow = () => {
  const soundsWindow = new BrowserWindow({
    width: 576,
    height: 1080,
    autoHideMenuBar : true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      devTools: true,
    },
  })
  soundsWindow.loadFile(path.join(__dirname, 'soundsPanel', 'index.html'))
}

const createDiceWindow = () => {
  const diceWindow = new BrowserWindow({
    width: 576,
    height: 1080,
    autoHideMenuBar : true,
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
    },
  })
  diceWindow.loadFile(path.join(__dirname, 'dices', 'index.html'))
}
const createPDFwindow = (PDFpath) => {
  const PDFwindow = new BrowserWindow({
    width: 576,
    height: 1080,
    autoHideMenuBar : true,
    icon: path.join(__dirname.replace('/src', ''), 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      devTools: true,
    },
  })
  PDFwindow.loadFile(PDFpath)
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

ipcMain.on('openPDF', (event, PDFpath)=>{
  createPDFwindow(PDFpath)
})
ipcMain.on('openSoundsPanel', createSoundsWindow)
ipcMain.on('openDices', createDiceWindow)
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
