const { app, ipcMain } = require('electron');
const path = require('path');
const UserData = app.getPath('userData')
const child = require("child_process")
const {BrowserWindow} = require("electron-acrylic-window");
const fs = require('fs');
let canQuit = true
app.setLoginItemSettings({
  openAtLogin: true,
  path: app.getPath('exe') // Set the executable path explicitly
});

if (require('electron-squirrel-startup')) {
  app.quit();
}

const op = {
  theme: 'light',
  effect: 'acrylic',
  useCustomWindowRefreshMethod: false,
  maximumRefreshRate: 120,
  disableOnBlur: true
}
let mainWindow
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 250,
    height: 1080,
    frame: false,
    transparent: true,
    vibrancy: [op],
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });
  mainWindow.setPosition(1920, 0);
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '\\main\\index.html'));
  
  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
  createPosWindow()
  ipcMain.on('askPath', ()=>{
    mainWindow.webContents.send('userData', UserData);
  })

  mainWindow.on('blur', ()=> {
    if (mainWindow.getPosition()[0] == 1920) return 0
    let pos = 1670
    let pos2 = 1620
    for (let i = 0; i< 125; i++) {
      pos = pos + 2
      pos2 = pos2 + 2
      mainWindow.setPosition(pos, 0);
      posWindow.setPosition(pos2, 490);
    }
    posWindow.webContents.send('hide')
  })
};

let posWindow
const createPosWindow = () => {
  posWindow = new BrowserWindow({
    width: 50,
    height: 100,
    frame: false,
    transparent: true,
    vibrancy: [op],
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });
  posWindow.setPosition(1870, 490);
  posWindow.loadFile(path.join(__dirname, '\\pos\\index.html'));
  posWindow.setAlwaysOnTop(true, "screen-saver")     // - 2 -
  posWindow.setVisibleOnAllWorkspaces(true)
  //posWindow.webContents.openDevTools();
}
let folderWindow
const createFolderWindow = () => {
  folderWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: true,
    vibrancy: [op],
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });
  folderWindow.setPosition(100, 100);
  // and load the index.html of the app.
  folderWindow.loadFile(path.join(__dirname, '\\folder\\index.html'));
  // Open the DevTools.
  //folderWindow.webContents.openDevTools();
  folderWindow.on('blur', ()=>{
    console.log(canQuit)
    if (canQuit){
      folderWindow.close()
    }
  })
  ipcMain.on('canQuit', ()=>{canQuit = true})
  ipcMain.on('cantQuit', ()=>{canQuit = false})
  ipcMain.on('getIcon', (event, path)=> {
    getIcon(path)
  })
}

async function getIcon(iconPath) {
  const fullPath = path.join(UserData, 'win-icon-extractor.exe');
  const defaultIcon = await fs.readFileSync(__dirname + '\\defaultIcon.txt', 'utf-8')
    const icon64 = await new Promise((resolve, reject) => {
        const childProcess = child.spawn(fullPath, [iconPath], { shell: true });
    
        let stdoutData = '';
        let stderrData = '';
    
        childProcess.stdout.on('data', (data) => {
            stdoutData += data.toString();
        });
    
        childProcess.stderr.on('data', (data) => {
            stderrData += data.toString();
        });
    
        childProcess.on('error', (err) => {
            console.error('Error:', err);
            //reject(new Error(err));
            resolve(defaultIcon)
        });
    
        childProcess.on('close', (code) => {
            if (code !== 0) {
                console.error('Process exited with code:', code);
                console.error('Stderr:', stderrData);
                //reject(new Error(`Process exited with code ${code}`));
                resolve(defaultIcon)
            } else {
              if (stdoutData == '') {
                resolve(defaultIcon)
              } else {
                resolve(stdoutData);
              }
            }
        });
    });
    folderWindow.webContents.send('iconData', icon64)
}

ipcMain.on('openFolder', ()=>{
  console.log('opening Folder')
  createFolderWindow()
})

ipcMain.on('makeVisible', () => {
  let pos = 1920
  let pos2 = 1870
  mainWindow.show()
  for (let i = 0; i< 125; i++) {
    pos = pos - 2
    pos2 = pos2 - 2
    mainWindow.setPosition(pos, 0);
    posWindow.setPosition(pos2, 490);
  }
});

ipcMain.on('makeInvisible', () => {
  let pos = 1670
  let pos2 = 1620
  for (let i = 0; i< 125; i++) {
    pos = pos + 2
    pos2 = pos2 + 2
    mainWindow.setPosition(pos, 0);
    posWindow.setPosition(pos2, 490);
  }
});
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
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
