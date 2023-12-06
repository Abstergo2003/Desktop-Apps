window.electron.ipcRenderer.on('iconData',function (event, iconData) {
    console.log(iconData)
    const id = data[data.length-1].id
    saveIcon(iconData, id)
})

window.electron.ipcRenderer.on('folder',function () {
    localStorage.setItem('folder', folder)
})