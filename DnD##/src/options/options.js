const defaultOptions = {"volume":50,"language":"en","addEnemy":80,"attack":79,"move":77,"dice":67,"setMap":73,"addPlayer":85}
const {readFileSync} = window.fs
const {writeFileSync} = window.fs
window.electron.ipcRenderer.send('askPath');
let optionsPath
var options
window.electron.ipcRenderer.on('userData', (event, userData)=>{
    optionsPath = userData + '\\options.json'
    console.log(optionsPath)
    options = JSON.parse(readFileSync(optionsPath, 'utf-8'))
    loadOptions()
})
const keyCodesPath = window.path.keyCodes
var keyCodes = JSON.parse(readFileSync(keyCodesPath, 'utf-8'))
 
let id
let overwriteBinds = false
let bind
function loadOptions() {
    document.getElementById('lang').src = `img/${options.language}.png`
    document.getElementById('lang').setAttribute('tag', options.language)
    document.getElementById('volume').value = options.volume
    document.getElementById('add-enemy').innerText = keyCodes[options.addEnemy]
    document.getElementById('attack').innerText = keyCodes[options.attack]
    document.getElementById('move').innerText = keyCodes[options.move]
    document.getElementById('dice').innerText = keyCodes[options.dice]
    document.getElementById('set-map').innerText = keyCodes[options.setMap]
    document.getElementById('add-player').innerText = keyCodes[options.addPlayer]
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
document.getElementById('add-enemy').addEventListener('click', (e)=>{
    overwriteBinds = true
    document.getElementById('add-enemy').innerText = ''
    bind = 'addEnemy'
    id = e.target.id
})
document.getElementById('attack').addEventListener('click', (e)=>{
    overwriteBinds = true
    document.getElementById('attack').innerText = ''
    bind = 'attack'
    id = e.target.id
})
document.getElementById('move').addEventListener('click', (e)=>{
    overwriteBinds = true
    document.getElementById('move').innerText = ''
    bind = 'move'
    id = e.target.id
})
document.getElementById('dice').addEventListener('click', (e)=>{
    overwriteBinds = true
    document.getElementById('dice').innerText = ''
    bind = 'dice'
    id = e.target.id
})
document.getElementById('set-map').addEventListener('click', (e)=>{
    overwriteBinds = true
    document.getElementById('set-map').innerText = ''
    bind = 'setMap'
    id = e.target.id
})
document.getElementById('add-player').addEventListener('click', (e)=>{
    overwriteBinds = true
    document.getElementById('add-player').innerText = ''
    bind = 'addPlayer'
    id = e.target.id
})
document.addEventListener('keyup', (e)=>{
    e = e || window.event
    var key = e.keyCode
    console.log(key)
    if (overwriteBinds == true) {
        overwriteBinds = false
        document.getElementById(id).innerText = keyCodes[key]
        options[bind] = key;
        writeFileSync(optionsPath, JSON.stringify(options), 'utf-8')
    }
})
document.getElementById('reset').addEventListener('click', ()=>{
    writeFileSync(optionsPath, JSON.stringify(defaultOptions), 'utf-8')
    options = defaultOptions
    loadOptions()
})
document.getElementById('back').addEventListener('click', ()=>{
    window.location.href = '../index.html'
})
document.addEventListener('click', ()=>{
    window.electron.ipcRenderer.send('button', 'ok');
})
