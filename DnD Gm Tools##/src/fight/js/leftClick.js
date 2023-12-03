function expandInsert(element, e) {
    var container = document.getElementById('leftClick')
    if (element.innerText == 'Insert...') {
        if (e.clientX > 1100) {
            for (var i = 0; i< options.length; i++) {
                container.innerHTML += `<span onclick="addToMap('${options[i]}', event)" class="option" style="top: calc(${i * 1.35}vw - 2px); left: calc(-12vw)">${options[i]}</span>`
            }
        } else {
            for (var i = 0; i< options.length; i++) {
                container.innerHTML += `<span onclick="addToMap('${options[i]}', event)" class="option" style="top: calc(${i * 1.35}vw - 2px); left: calc(12vw)">${options[i]}</span>`
            }
        }
        
    }
}

function expandSize() {
    document.getElementById('leftClick').innerHTML += `<input type="number" onchange="defineSize(this)" placeholder="Define area size">`
}

function hide(element) {
    element.style.left = '-2000px'
    var options = element.querySelectorAll('.option')
    options.forEach(option => {
        option.remove()
    });
    var inputs  = element.querySelectorAll('input')
    inputs.forEach(input => {
        input.remove()
    })
}

document.addEventListener('contextmenu',(e) =>  {
    e.preventDefault()
    clickArea = e.target.id
    target = e.target
    clickX = e.clientX
    clickY = e.clientY
    var options = document.getElementById('leftClick')
    if (e.pageX > 1100) {
        options.style.left = `calc(-12vw + 10px + ${e.pageX}px)`
    } else {
        options.style.left = e.pageX - 10 + 'px'
    }
    if (e.pageY > 600) {
        options.style.top = e.pageY - options.offsetHeight + 10 + 'px'
    } else {
        options.style.top = e.pageY - 10 + 'px'
    }
});

function addToMap(type, e) {
    if (clickArea != 'area') return 0
    var left = clickX - areaPosition.x
    var top = clickY - areaPosition.y
    const date = new Date()
    const timestamp = date.getTime() 
    if (type != 'Water' && type != 'Mud' && type != 'Hole' && type != 'Rock') {
        var elem = document.createElement('div')
        elem.classList.add('areaObject')
        elem.classList.add(`area${type}`)
        elem.style.height = data.size + 'px'
        elem.style.width = data.size + 'px'
        elem.style.left = left + 'px'
        elem.style.top = top + 'px'
        elem.style.filter += `invert(${Math.floor(Math.random()*100)}%)`
        elem.style.filter += `sepia(${Math.floor(Math.random()*100)}%)`
        elem.style.filter += `saturate(${Math.floor(Math.random()*2000)}%)`
        elem.style.filter += `hue-rotate(${Math.floor(Math.random()*360)}deg)`
        elem.style.filter += `contrast(${Math.floor(Math.random()*200)}%);`
        elem.id = timestamp
        elem.setAttribute('movable', true)
        document.getElementById('area').append(elem)
        var obj = {
            type: type,
            left: left,
            top: top,
            id : timestamp
        }
        objects.push(obj)
    } else {
        if (type == 'Water') {strokeColor = 'blue'}
        if (type == 'Mud') {strokeColor = 'rgb(72, 42, 15)'}
        if (type == 'Rock') {strokeColor = 'grey'}
        var elem = document.createElement('canvas')
        elem.classList.add('cv')
        elem.id = timestamp
        elem.style.top = top + 'px'
        elem.style.left = left + 'px'
        elem.classList.add('edited')
        document.getElementById('area').append(elem)

        canvas = elem
        ctx = elem.getContext('2d')
        elem.width = elem.offsetWidth
        elem.height = elem.offsetHeight
        isCanvasEditing = true
        var obj = {
            type: 'canvas',
            left: left,
            top: top,
            id: timestamp
        }
        objects.push(obj)
        document.getElementById(timestamp).addEventListener('mousedown', startDrawing, true)
        document.getElementById(timestamp).addEventListener('mousemove', drawing, true)
        document.getElementById(timestamp).addEventListener('mouseup', ()=>{
            var canvas = document.getElementById(timestamp)
            isDrawing = false
        })
    }
    console.log('added')
    hide(document.getElementById('leftClick'))
}

function deleteFromMap() {
    if (target.classList[0] != 'areaObject' && target.classList[0] != 'cv') return 0
    const isID = (element) => element.id == target.id;
    const index = objects.findIndex(isID)
    objects.splice(index, 1)
    target.remove()
    hide(document.getElementById('leftClick'))
}

async function deleteFromTray() {
    for (var i = 0; i<7; i++) {
        if (target.classList[0] == 'character') {
            break
        }
        target = target.parentNode
    }
    if (target.classList[0] != 'character') return 0

    hide(document.getElementById('leftClick'))
    const isID = (element) => element.id == target.id;
    const index = characters.findIndex(isID)
    characters.splice(index, 1)
    target.remove()
}

function checkIFparent() {
    var parent  = target.parentElement

    if (parent.classList[0] == 'character') return parent
    var parent2 = parent.parentElement

    if (parent2.classList[0] == 'character') return parent2
    var parent3 = parent2.parentElement

    if (parent3.classList[0] == 'character') return parent3
    var parent4 = parent3.parentElement

    if (parent4.classList[0] == 'character') return parent4

    return 0
}

async function back() {
    await writeFileSync(tempPath, JSON.stringify(data))
    history.back()
}

async function forward() {
    await writeFileSync(tempPath, JSON.stringify(data))
    history.forward()
}