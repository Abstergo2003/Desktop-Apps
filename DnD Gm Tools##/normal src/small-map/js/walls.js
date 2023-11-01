function loadWallsHolders() { //loads just holders without data
    var holder = document.querySelector('.holder')
    for (var i = 0 ; i <780; i++) {
        holder.innerHTML += `
            <div id="${i}" class="elem grid"></div>`
    }
}
loadWallsHolders()
document.addEventListener('mousedown', ()=>{
    url = localStorage.getItem('wall')
    isDown = true
})
document.addEventListener('mouseup', ()=>{
    isDown = false
})
document.addEventListener('mousemove', (e)=>{
    if (!isDown) return 0
    console.log(e.target.classList[0])
    if (e.target.classList[0] != 'elem') return 0
    if (isWallsMode) {
        e.target.style.backgroundImage = `url(${url})`
        updateWalls(e.target.id, url)
    }
})
function loadWalls() { //adds data to previously loaded holders
    var walls = data.walls
    for (var i = 0; i<walls.length; i++) {
        document.getElementById(walls[i].id).style.backgroundImage = `url(img/${walls[i].type}.png)`
    }
}
function updateWalls(id, type) {
    var result = data.walls.filter(wall => wall.id == id)
    if (result.length == 0) {
        var obj = {
            id: id,
            type: type.replace('img/', '').replace('.png', '')
        }
        data.walls.push(obj)
    } else {
        var wall = result[0]
        wall.type = type.replace('img/', '').replace('.png', '')
    }
}
function loadBackground() {
    const contents = readFileSync(tempPath + '\\map.png', {encoding: 'base64'});
    document.querySelector('.holder').style.backgroundImage = `url(data:image/jpeg;base64,${contents})`
}
loadBackground()
loadWalls()