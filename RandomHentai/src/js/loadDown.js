const {readFileSync} = window.fs
const {writeFileSync} = window.fs
const {rmSync} = window.fs
let userDataPath
let VarUrl
let coversPath
window.electron.ipcRenderer.send('askPath');
window.electron.ipcRenderer.on('userData',function (event, userData) {
	userDataPath = userData
	VarUrl = userData + '/variables.json'
	coversPath = userData
    load()
})
const DownloadPath = window.path.download
var holder = document.getElementById('DownHolder')
var file = JSON.parse(readFileSync(VarUrl, 'utf-8'))
function load() {
    holder.innerHTML = ''
    for (var i = 0; i <file.downloaded.length; i++) {
        holder.innerHTML += `<div class="container"><img src="${DownloadPath+'/'+file.downloaded[i].id+'/1.jpg'}"><h3>${file.downloaded[i].title}</h3><div id="${i}" class="button"></div></div>`
    }
}
function remove(id) {
    RmPath = DownloadPath + '/' + file.downloaded[id].id+'/'
    console.log(RmPath)
    rmSync(RmPath, {recursive: true, force: true })
    file.downloaded.splice(id, 1)
    console.log(file)
    writeFileSync(VarUrl, JSON.stringify(file), 'utf-8')
    load()
}
document.addEventListener('click', (e)=>{
    let did = e.target.id
    console.log(did)
    if (+did) {
        console.log('removing')
        remove(did)
    } else if (did == '0') {
        console.log('removing')
        remove(did)
    }
})