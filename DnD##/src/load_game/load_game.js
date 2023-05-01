const {readFileSync} = window.fs
const {writeFileSync} = window.fs
const {rmSync} = window.fs
const {join} = window.path
let __dirname
var saves
window.electron.ipcRenderer.send('askPath');
window.electron.ipcRenderer.on('userData', (event, userData)=>{
    __dirname = userData
    saves = JSON.parse(readFileSync(userData + '\\saveTable.json', 'utf-8'))
    console.log(saves)
    saveLoader()
})
let isDelete = false
function saveLoader() {
    for (var i = 0; i < saves.length; i++) {
        console.log('adding save')
        document.body.innerHTML += 
        `<div class="save" id="${i}">
            <img src="${saves[i].const.pathToIcon || 'img/save.svg'}"class="icon" id="${i}">
            <table id="${i}">
                <tr id="${i}">
                    <td id="${i}">${saves[i].const.name}</td>
                </tr>
                <tr id="${i}">
                    <td id="${i}"><img src="img/localization.svg" class="small-icon" id="${i}">${saves[i].const.localization}, <img src="img/villain.svg" class="small-icon" id="${i}">${saves[i].const.villain}</td>
                </tr>
            </table>
        </div>`
    }
}
document.addEventListener('click', (e)=>{
    window.electron.ipcRenderer.send('button', 'ok');
    let id = e.target.id
    console.log(id)
    if (id == 'back') {
        window.location.href = '../index.html'
        return 0
    }
    if (id == 'delete') {
        //eneables and disbles deleting mode
        if (isDelete == false) {
            isDelete = true
            document.getElementById('delete').classList.add('clicked')
        } else {
            isDelete = false
            document.getElementById('delete').classList.remove('clicked')
        }
        return 0
    }
    if (isDelete == true && +id) {
        console.log('deleting')
        saves = saves.slice(id, id)
        writeFileSync(join(__dirname, 'saveTable.json'), JSON.stringify(saves))
        document.body.innerHTML = '<h1>Your Games</h1><div class="button" id="back">Back</div><div class="button" id="delete"><img src="img/trash.svg" id="delete"></div>'
        document.getElementById('delete').classList.add('clicked')
        saveLoader()
    } else if (isDelete == true && id == '0'){
        saves = saves.slice(0,0)
        writeFileSync(join(__dirname, 'saveTable.json'), JSON.stringify(saves))
        document.body.innerHTML = '<h1>Your Games</h1><div class="button" id="back">Back</div><div class="button" id="delete"><img src="img/trash.svg" id="delete"></div>'
        document.getElementById('delete').classList.add('clicked')
        saveLoader()
    } else {
        var saveToLoad = saves[id]
        saveToLoad.id = id
        writeFileSync(join(__dirname, 'saveToLoad.json'), JSON.stringify(saveToLoad))
        window.electron.ipcRenderer.send('create-load-window');
        window.electron.ipcRenderer.send('play-game', 'ok');
        window.location.href = '../index.html'
    }
})
