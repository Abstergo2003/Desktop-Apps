const { contextBridge, ipcRenderer } = require('electron');
const say = require("say")
const fs = require('fs')
contextBridge.exposeInMainWorld("electron", {
    ipcRenderer: {
      ...ipcRenderer,
      on: ipcRenderer.on.bind(ipcRenderer),
      removeListener: ipcRenderer.removeListener.bind(ipcRenderer),
    },
});
contextBridge.exposeInMainWorld('fs', {
  readFileSync: fs.readFileSync,
  writeFileSync: fs.writeFileSync
})
contextBridge.exposeInMainWorld('say', {
  speak: say.speak
})