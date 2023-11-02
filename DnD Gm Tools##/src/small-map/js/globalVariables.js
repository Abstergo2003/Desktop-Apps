const {readFileSync, writeFileSync, copyFile} = window.fs
const {join} = window.path
const options = ['Bed', 'Chest', 'Desk', 'Wardrobe', 'Corpse', 'Weapon', 'BloodPool', 'NPC', 'Enemy', 'Boss', 'Pet', 'Player']
const walls = ['blank','neutral', 'vertical', 'horizontal', 'LTS corner', 'RTS corner', 'LBS corner', 'RBS corner', 'LTR corner', 'RTR corner', 'LBR corner', 'RBR corner', 'H Window','V Window', 'H Doors','V Doors', 'H Stairs', 'V Stairs']
let ID = null
let isDown = false
let isWallsMode = false
let url = undefined
let container = undefined
const savesPath = localStorage.getItem('savesPath')
const currenSave = localStorage.getItem('currentSave')
const subMap = localStorage.getItem('sSubMap')
const tempPath = join(savesPath, currenSave, 'maps', subMap)
const mapPath = join(tempPath, 'map.json')
const itemsPath = join(savesPath, currenSave, 'items.json')
const items = JSON.parse(readFileSync(itemsPath, 'utf-8'))
let data = JSON.parse(readFileSync(mapPath, 'utf-8'))

