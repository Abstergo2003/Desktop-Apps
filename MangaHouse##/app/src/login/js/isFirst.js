var isFirst = localStorage.getItem('isFirst')
let userPath
if (!isFirst) {
    console.log('first run')
    window.electron.ipcRenderer.send('askPath');
    window.electron.ipcRenderer.on('userData',function (event, userData) {
        console.log(userData)
        userPath = userData
        localStorage.setItem('path', userData)
        localStorage.setItem('isFirst', false)
    })
} else {
    console.log('not first')
    userPath = localStorage.getItem('path')
    console.log(userPath)
}