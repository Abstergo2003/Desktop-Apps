const options = ['Boss', 'Enemy', 'Player', 'NPC', 'Pet', 'Rock', 'Mud', 'Water', 'Hole']
const {readFileSync, writeFileSync} = window.fs
const {join} = window.path
const savesPath = localStorage.getItem('savesPath')
const currentSave = localStorage.getItem("currentSave")
let tempPath = join(savesPath,  currentSave, 'fight.json')
var clickArea = null
var step
let isDrawing = false
let brushWidth = 5
let strokeColor = 'black'
let prevMouseX, prevMouseY, snapshot
let canvas = null
let ctx = null
let clickX, clickY
let target
var areaPosition = {
    x: Math.floor(document.querySelector('.area').getBoundingClientRect().left),
    y: Math.floor(document.querySelector('.area').getBoundingClientRect().top),
    width: document.querySelector('.area').offsetWidth,
    height: document.querySelector('.area').offsetHeight,
}
var isDown = false
let data = JSON.parse(readFileSync(tempPath, 'utf-8'))
var characters = data.tray
var objects = data.area
var tour = 0
var isCanvasEditing
document.addEventListener('keydown', (e)=>{
    if (!isCanvasEditing) return 0
    if (e.keyCode == 13) {
        console.log('finishing editing')
        isDrawing = false
        var imgData = canvas.toDataURL()
        var result = objects.filter(obj => obj.id == canvas.id)[0]
        result.imgData = imgData
        canvas.setAttribute('movable', true)
        canvas.removeEventListener('mousedown', startDrawing, true)
        canvas.removeEventListener('mousemove', drawing, true)
        canvas.classList.remove('edited')
        canvas = null
        ctx = null
    }
})