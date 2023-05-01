const {readFileSync} = window.fs
const {writeFileSync} = window.fs
const {join} = window.path
let charactersPath
let __dirname
let characters
let characterToLoadPath
window.electron.ipcRenderer.send('askPath');
window.electron.ipcRenderer.on('userData', (event, userData)=>{
    __dirname = userData
    charactersPath = userData + '\\characters.json'
    characterToLoadPath = join(__dirname, 'characterToLoad.json')
    characters = JSON.parse(readFileSync(charactersPath, 'utf-8'))
    console.log(characters)
    charatersLoader()
})
 
let isDelete = false
function charatersLoader() {
    var container = document.getElementById('container')
    for (var i = 0; i<characters.length; i++) {
        container.innerHTML += 
        `<div class="character" id="${i}">
            <img src="img/${characters[i].const.class}.jpg" class="icon" id="${i}" onerror="this.onerror=null; this.src='img/default.svg'">
            <h2 id="${i}">${characters[i].const.name}</h2>
            <h3 id="${i}">${characters[i].const.level} lvl</h3>
        </div>`
    }
}
function newCharacter() {
    obj = {"const":{"name":"","class":"","level":"","background":"","race":"","alignment":""},"attributes":{"main":{"base":{"strength":"","dexterity":"","constitution":"","intelligence":"","wisdom":"","charisma":""},"added":{"strength":"","dexterity":"","constitution":"","intelligence":"","wisdom":"","charisma":""}},"stuff":{"ac":"","initiative":"","speed":"","maxHP":"","currentHP":"","deathSaves":{"succeses":0,"failures":0}},"savingThrows":{"strength":"","dexterity":"","constitution":"","intelligence":"","wisdom":"","charisma":""},"skills":{"acrobatics":"","animal":"","arcana":"","athletics":"","deception":"","history":"","insight":"","intimidation":"","investigation":"","medicine":"","nature":"","perception":"","performance":"","persuasion":"","religion":"","sleightOfHand":"","stealth":"","survival":""},"passiveWisdom":"","proficiencyBonus":""},"equipment":{"weapons":[],"treasures":{"money":{"cp":"","sp":"","ep":"","gp":"","pp":""},"other":""},"backpack":""},"features":"","characterDescription":{"appearance":"","background":""}}
    obj.id = -1
    writeFileSync(characterToLoadPath, JSON.stringify(obj))
    window.location.href = 'showCharacter.html'
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
    if (+id  || id == '0') {
        if (isDelete == true) {
            console.log('deleting')
            characters.splice(id, 1)
            writeFileSync(charactersPath, JSON.stringify(characters))
            document.getElementById('container').innerHTML = ''
            charatersLoader()
        } else {
            console.log('loading')
            characters[id].id = id
            writeFileSync(characterToLoadPath, JSON.stringify(characters[id]))
            window.location.href = 'showCharacter.html'
        }
    }
    if (id == 'add') {
        newCharacter()
    }
})