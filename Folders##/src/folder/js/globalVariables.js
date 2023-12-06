const savesPath = localStorage.getItem('savesPath')
const folder = localStorage.getItem('folderID')
const {readFileSync, writeFileSync, existsSync} = window.fs
const {exec, spawn} = window.child
const {wsquery} = window.shortcuts
const {dirname, join} = window.path
let typingTimer; // Timer identifier
const doneTypingInterval = 1000
let isCtrl = false
data = []

async function read() {
    data = await JSON.parse(readFileSync(savesPath + `\\folders\\${folder}.json`, 'utf-8'))
}
function save() {
    writeFileSync(savesPath + `\\folders\\${folder}.json`, JSON.stringify(data))
}
async function saveIcon(base64, id) {
    console.log(base64)
    await writeFileSync(savesPath + `\\icons\\${id}.txt`, base64)
    document.location.reload()
}
async function getIcon(id) {
    const exists = await existsSync(savesPath + `\\icons\\${id}.txt`)
    console.log(exists)
    if (!exists) return ''
    console.log('getting icon')
    const icon = await readFileSync(savesPath + `\\icons\\${id}.txt`, 'utf-8')
    return icon
}
read() 