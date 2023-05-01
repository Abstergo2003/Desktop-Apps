const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path  = require('path')
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
    join : path.join,
    dirname : __dirname
    // Add other methods and properties of the path module that you need.
});