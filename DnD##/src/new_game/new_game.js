const {readFileSync} = window.fs
const {writeFileSync} = window.fs
const {writeFile} = window.fs
const {join} = window.path
let __dirname
window.electron.ipcRenderer.send('askPath');
window.electron.ipcRenderer.on('userData', (event, userData)=>{
    __dirname = userData
    saves = JSON.parse(readFileSync(userData + '\\saveTable.json', 'utf-8'))
    console.log(saves)
    saveLoader()
})
document.getElementById('back').addEventListener('click', ()=>{
    window.location.href = '../index.html'
})
document.getElementById('ok').addEventListener('click', ()=>{
    var obj = {
        "const" : {
            "name": document.getElementById('name').value,
            "topic": document.getElementById('topic').value,
            "villain" : document.getElementById('villain').value,
            "localization" : document.getElementById('loc').value,
            "description" : document.getElementById('desc').value,
            "pathToIcon" : document.getElementById('path').value.replaceAll("\\", '/')
        },
        "temp" : {
            "mobs" : [],
            "players": [],
            "path": "",
            "step" : 40,
            "marginL" : 0,
            "marginT" : 0
        },
        "logs" : [],
        "id" : -1
    }
    if (document.getElementById('name').value == '') {
        document.getElementById('name').style.backgroundColor = 'red'
        return 0
    }
    saves.push(obj)
    writeFileSync(join(__dirname, 'saveTable.json'), JSON.stringify(saves))
    writeFileSync(join(__dirname, 'saveToLoad.json'), JSON.stringify(obj))
    window.location.href = '../index.html'
    window.electron.ipcRenderer.send('create-load-window');
})
document.addEventListener('click', ()=>{
    window.electron.ipcRenderer.send('button', 'ok');
})