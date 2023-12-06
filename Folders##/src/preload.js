const { contextBridge, ipcRenderer} = require('electron');
const child = require('child_process')
const fs = require('fs')
const path = require('path')
const ws = require('windows-shortcuts')

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
    readFile: fs.readFile,
    readdir: fs.readdir,
    copyFile: fs.copyFile,
    existsSync: fs.existsSync,
    rmSync: fs.rmSync
});

contextBridge.exposeInMainWorld('path', {
    dirname : __dirname,
    join: path.join
});

contextBridge.exposeInMainWorld('child', {
    exec: child.exec,
    spawn: child.spawn
})

contextBridge.exposeInMainWorld('shortcuts', {
    wsquery: ws.query
})
