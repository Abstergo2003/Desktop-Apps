// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
contextBridge.exposeInMainWorld('fs', {
    writeFileSync: fs.writeFileSync,
    readFileSync: fs.readFileSync,
    writeFile: fs.writeFile
})
contextBridge.exposeInMainWorld('path', {
  dirn: __dirname
})
contextBridge.exposeInMainWorld("electron", {
    ipcRenderer: {
      ...ipcRenderer,
      on: ipcRenderer.on.bind(ipcRenderer),
      removeListener: ipcRenderer.removeListener.bind(ipcRenderer),
    },
  });
