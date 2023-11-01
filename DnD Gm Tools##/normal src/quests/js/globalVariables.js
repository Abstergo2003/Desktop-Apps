const {readFileSync, writeFileSync} = window.fs
const {join} = window.path
const savesPath = localStorage.getItem('savesPath')
const currentSave = localStorage.getItem('currentSave')
const tempPath = join(savesPath, currentSave, 'quests.json')
const quickLoactionsPath = join(savesPath, currentSave, 'quickLocations.json')
let target
let quests = JSON.parse(readFileSync(tempPath, 'utf-8'))
const quickLocations = JSON.parse(readFileSync(quickLoactionsPath, 'utf-8'))