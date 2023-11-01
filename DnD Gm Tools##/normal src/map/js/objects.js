function loadObjects() {
    var holder = document.querySelector('.wrapper')
    for (var i = 0; i<data.length; i++) {
        var obj = data[i]
        if (obj.mark.type != null) {
            var elem = `
                <div class="object marked" id="${obj.id}" type="${obj.type}" style="left: ${obj.position.x}px; top: ${obj.position.y}px">
                    <img src="img/${obj.type}.png" onclick="setSubMap('${obj.mark.type}', '${obj.mark.id}')"><br>
                    <input type"text" value="${obj.name}" oninput="update(${obj.id})">
                </div>`
        } else {
            var elem = `
                <div class="object" id="${obj.id}" type="${obj.type}" style="left: ${obj.position.x}px; top: ${obj.position.y}px">
                    <img src="img/${obj.type}.png" onclick="setSubMap('${obj.mark.type}', '${obj.mark.id}')"><br>
                    <input type"text" value="${obj.name}" oninput="update(${obj.id})">
                </div>`
        }
        holder.innerHTML += elem
    }
}
loadObjects()

async function setSubMap(map, id) {
    if (tool != 'cursor') return 0
    if (map == 'null') {
        console.log('no mark')
        return 0
    } else if (map == 'B') {
        await writeFileSync(tempPath, JSON.stringify(data))
        localStorage.setItem('bSubMap', id)
        location.href = '../big-map/index.html'
    } else {
        await writeFileSync(tempPath, JSON.stringify(data))
        localStorage.setItem('sSubMap', id)
        location.href = '../small-map/index.html'
    }
}

function parent(elem) {
    if (elem.classList[0] == 'object') {
        return elem
    } else {
        var parent = elem.parentElement
        if (typeof parent == 'undefined') return undefined
        if (parent.classList[0] == 'object') {
            return parent
        } else {
            return undefined
        }
    }
}

function update(id) {
    var target = document.getElementById(id)
    const isID = (element) => element.id == id;
    var result = data.findIndex(isID)
    var x = target.style.left
    var xpos = target.style.left.indexOf('px')
    var left = +x.slice(0, xpos)
    var y = target.style.top
    var ypos = target.style.top.indexOf('px')
    var top = +y.slice(0, ypos)
    var name = target.querySelector('input').value
    data[result].position.x = left
    data[result].position.y = top
    data[result].name = name
}

document.addEventListener('mousedown', (e)=>{
    isDown = true
    previousX = e.clientX,
    previousY = e.clientY
    target = parent(e.target)
})
document.addEventListener('mousemove', (e)=>{
    if (!isDown) return 0
    if (tool != 'move') return 0
    if (target == undefined) return 0
    target.style.left = e.pageX + 'px'
    target.style.top = e.pageY + 'px'
})
document.addEventListener('mouseup', ()=>{
    isDown = false
    if (typeof target === 'undefined') return 0
    update(target.id)
})
document.addEventListener('keydown', (e)=>{
    if (e.keyCode == 32) {
        e.preventDefault()
        tool = 'cursor'
    }
})

function loadBackgorund() {
    let img = join(savesPath, currentSave, 'map.png')
    const contents = readFileSync(img, {encoding: 'base64'});
    document.querySelector('.wrapper').style.backgroundImage = `url(data:image/jpeg;base64,${contents})`
}
loadBackgorund()

function handleMouse(e) {
    if (!isDown) return 0
    if (tool != 'cursor') return 0
    var left = e.clientX - previousX
    var top = e.clientY - previousY
    if (previousX && previousY) {
        window.scrollBy(-left, -top);
    }

    previousX = e.clientX;
    previousY = e.clientY;
}
document.onmousemove = handleMouse;