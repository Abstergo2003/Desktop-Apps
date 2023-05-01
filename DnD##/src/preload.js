const { contextBridge, ipcRenderer } = require('electron');
const {spawn} = require('child_process')
const fs = require('fs');
const path  = require('path')
console.log(__dirname+'/sounds/menu.mp3')
const optionsPath = path.join(__dirname, 'options.json')
const savesPath = path.join(__dirname,'saves')
const keyCodesPath = path.join(__dirname, 'keyCodes.json')
const charactersPath = path.join(__dirname, 'characters.json')
contextBridge.exposeInMainWorld("electron", {
    ipcRenderer: {
      ...ipcRenderer,
      on: ipcRenderer.on.bind(ipcRenderer),
      removeListener: ipcRenderer.removeListener.bind(ipcRenderer),
    },
  });
contextBridge.exposeInMainWorld('fs', {
    readFileSync: fs.readFileSync,
    writeFileSync: fs.writeFileSync,
    createWriteStream: fs.createWriteStream,
    mkdir: fs.mkdir,
    rmSync: fs.rmSync,
    writeFile: fs.writeFile,
    readFile: fs.readFile
    // Add other methods and properties of the fs module that you need.
});
contextBridge.exposeInMainWorld('path', {
    options: optionsPath,
    saves: savesPath,
    keyCodes: keyCodesPath,
    characters : charactersPath,
    join : path.join,
    dirname : __dirname,
    // Add other methods and properties of the path module that you need.
});
contextBridge.exposeInMainWorld('child', {
    spawn : spawn
})