const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron');
const path = require('path');
const UserData = app.getPath('userData')
console.log(UserData)
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}
let child = undefined
let joinWin = undefined
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    autoHideMenuBar : true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      devTools: true,
    },
  });
  mainWindow.on('close', ()=>{
    if (process.platform !== 'darwin') {
      app.quit();
    }
  })
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  
  // Open the DevTools.
  const sound = new BrowserWindow({
    width: 60,
    height: 60,
    autoHideMenuBar : true,
    webPreferences: {
      preload: path.join(__dirname, 'preload4.js'),
      nodeIntegration: true,
      devTools: true,
    },
  });
  sound.loadFile(path.join(__dirname, 'music.html'))
  sound.hide()
  ipcMain.on('play-game', ()=>{
    sound.webContents.send('play-game', 'ok');
  })
  ipcMain.on('button', ()=>{
    sound.webContents.send('button', 'ok');
  })
   
  ipcMain.on('create-load-window', () => {
    child = new BrowserWindow({
      parent: mainWindow,
      width: 1920,
      height: 1080,
      autoHideMenuBar : true,
      webPreferences: {
        preload: path.join(__dirname, 'preload2.js'),
        nodeIntegration: true,
        devTools: true,
      },
    })
    child.loadFile(path.join(__dirname, 'redirect.html'))
    child.on('close', ()=>{
      sound.webContents.send('play-menu', 'ok');
      child = undefined
    })
  });

  ipcMain.on('create-join-window',  (url) => {
    let joinWin = new BrowserWindow({
      parent: mainWindow,
      width: 1920,
      height: 1080,
      autoHideMenuBar : true,
      webPreferences: {
        preload: path.join(__dirname, 'preload3.js'),
        nodeIntegration: true,
        devTools: true,
      },
    })
    joinWin.loadFile(path.join(__dirname, 'redirect2.html'))
    ipcMain.on('close-child', ()=>{
      joinWin.close()
    })
    joinWin.on('close', ()=>{
      sound.webContents.send('play-menu', 'ok');
      joinWin = undefined
    })
  });
  ipcMain.on('askPath', ()=>{
    mainWindow.webContents.send('userData', UserData);
    if (joinWin) {
      joinWin.webContents.send('userData', UserData);
    } else {
      
    }
    if (child) {
      child.webContents.send('userData', UserData);
    } else {
      
    }
    
  });
};
// Create the browser window.
  
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', ()=>{
  createWindow()
});


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
