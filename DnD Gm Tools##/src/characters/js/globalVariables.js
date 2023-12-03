const {readFileSync, writeFileSync, existsSync, copyFile} = window.fs
const {join} = window.path
const savesPath = localStorage.getItem('savesPath')
const currentSave = localStorage.getItem('currentSave')
const tempPath = join(savesPath, currentSave, 'characters.json')
var items = JSON.parse(readFileSync(tempPath, 'utf-8'))
const playable = ['dragonborn', 'dwarf', 'elf', 'gnome', 'halfElf', 'halfling', 'halfOrc', 'human', 'tiefling']