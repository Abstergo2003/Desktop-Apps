if (!localStorage.getItem('savesPath')) {
    window.electron.ipcRenderer.send('askPath');
    window.electron.ipcRenderer.on('userData',function (event, userData) {
        localStorage.setItem('savesPath', userData)
        copyFile(dirname+'\\win-icon-extractor.exe', userData+'\\win-icon-extractor.exe', (err)=>{
            if (err) {
                console.error(err)
            } else {
                console.log('copied')
                document.location.reload()
            }
        })
    })
}