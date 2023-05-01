const {readFileSync} = window.fs
const {writeFileSync} = window.fs
let optionsPath
var options
window.electron.ipcRenderer.send('askPath');
window.electron.ipcRenderer.on('userData', (event, userData)=>{
    optionsPath = userData + '\\options.json'
    console.log(optionsPath)
    options = JSON.parse(readFileSync(optionsPath, 'utf-8'))
    loadOptions()
    loadRecords(userData)
})
function loadOptions() {
    document.getElementById('lang').src = `img/${options.language}.png`
    document.getElementById('lang').setAttribute('tag', options.language)
    document.getElementById('volume').value = options.volume
}
function loadRecords(path) {
    var records = JSON.parse(readFileSync(path + '\\highscores.json', 'utf-8'))
    document.getElementById('snake').innerText = records.snake
    document.getElementById('memory').innerText = records.memory
    document.getElementById('hide-n-seek').innerText = records.hideNseek
}
function back() {
    window.location.href = '../index.html'
}
document.getElementById('volume').addEventListener('change', ()=>{
    options.volume = document.getElementById('volume').valueAsNumber
    writeFileSync(optionsPath, JSON.stringify(options), 'utf-8')
})
document.getElementById('lang').addEventListener('click', ()=>{
    var obj = document.getElementById('lang')
    var lang = obj.getAttribute('tag')
    if (lang == 'en') {
        obj.setAttribute('tag', 'pl')
        obj.src = 'img/pl.png'
        options.language = 'pl'
        writeFileSync(optionsPath, JSON.stringify(options), 'utf-8')
    } else {
        obj.setAttribute('tag', 'en')
        obj.src = 'img/en.png'
        options.language = 'en'
        writeFileSync(optionsPath, JSON.stringify(options), 'utf-8')
    }
})
document.getElementById('back').addEventListener('click', back)