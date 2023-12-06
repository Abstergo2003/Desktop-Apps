const {readFileSync, writeFileSync, existsSync, copyFile} = window.fs
const {dirname} = window.path
const savesPath = localStorage.getItem('savesPath')
let data = JSON.parse(readFileSync(savesPath + '\\folders.json', 'utf-8'))
var isCtrl = false
let typingTimer; // Timer identifier
const doneTypingInterval = 1000

async function load() {
    var holder = document.querySelector('.holder')
    for (obj in data) {
        obj = data[obj]
        const icon = await getIcon(obj.id)
        holder.innerHTML += 
            `<div class="icon" id="${obj.id}" >
                <img src="data:image/jpeg;base64,${icon}" onclick="determineAction('${obj.id}', event)"><br>
                <input value="${obj.name}">
            </div>`
    }
    holder.innerHTML += 
        `<div class="icon safe" onclick="addFolder()">
            <img src="img/add.svg" style="filter: invert(95%) sepia(94%) saturate(26%) hue-rotate(355deg) brightness(106%) contrast(107%)"><br>
        </div>`
}
async function getIcon(id) {
    const exists = await existsSync(savesPath + `\\icons\\${id}.txt`)
    console.log(exists)
    if (!exists) return ''
    console.log('getting icon')
    const icon = await readFileSync(savesPath + `\\icons\\${id}.txt`, 'utf-8')
    return icon
}
load()