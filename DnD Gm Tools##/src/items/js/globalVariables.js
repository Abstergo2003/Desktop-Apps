const {readFileSync, writeFileSync} = window.fs
const {join} = window.path
const savesPath = localStorage.getItem('savesPath')
const currentSave = localStorage.getItem('currentSave')
const tempPath = join(savesPath, currentSave, 'items.json')
var items = JSON.parse(readFileSync(tempPath, 'utf-8'))