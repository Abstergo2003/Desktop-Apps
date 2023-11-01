function hide(el) {
    var element = document.getElementById('leftClick')
    element.style.left = '-2000px'
    var options = element.querySelectorAll('.option')
    options.forEach(option => {
        option.remove()
    });
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

function expandInsert(element, e) {
    var container = document.getElementById('leftClick')
    if (element.innerText == 'Insert...') {
        if (e.clientX > 1100) {
            for (var i = 0; i< options.length; i++) {
                container.innerHTML += `<span onclick="addToMap('${options[i]}', event)" class="option" style="top: calc(${i * 1.35}vw - 2px); left: calc(-12vw)">${options[i]}</span>`
            }
        } else {
            for (var i = 0; i< options.length; i++) {
                container.innerHTML += `<span onclick="addToMap('${options[i]}')" class="option" style="top: calc(${i * 1.35}vw - 2px); left: calc(12vw)">${options[i]}</span>`
            }
        }
    } else {
        if (e.clientX > 1100) {
            for (var i = 0; i< walls.length; i++) {
                container.innerHTML += `<span onclick="localStorage.setItem('wall', 'img/${walls[i].replace(' ', '').toLowerCase()}.png'); hide(); wallsMode()" class="option" style="top: calc(${i * 1.35}vw - 2px); left: calc(-12vw)">${walls[i]}</span>`
            }
        } else {
            for (var i = 0; i< walls.length; i++) {
                container.innerHTML += `<span onclick="localStorage.setItem('wall', 'img/${walls[i].replace(' ', '').toLowerCase()}.png'); hide(); wallsMode()" class="option" style="top: calc(${i * 1.35}vw - 2px); left: calc(12vw)">${walls[i]}</span>`
            }
        }
    }
}

function wallsMode() {
    document.querySelector('.area').style.zIndex = -1
    isWallsMode = true
    hide(document.getElementById('leftClick'))
}

function objectMode() {
    document.querySelector('.area').style.zIndex = 10
    isWallsMode = false
    hide(document.getElementById('leftClick'))
}
function deleteFromMap() {
    if (target.classList[0] != 'areaObject') return 0
    target.remove()
    updateObjects(target.id)
    hide()
}

function addToMap(type) {
    if (clickArea != 'area') return 0

    var left = clickX
    var top = clickY
    var elem = document.createElement('div')
    elem.classList.add('areaObject')
    elem.classList.add(`area${type}`)
    elem.style.left = left + 'px'
    elem.style.top = top + 'px'
    document.getElementById('area').append(elem)

    const date = new Date()
    const timestamp = date.getTime()
    var obj = {
        id: timestamp,
        left: left,
        top: top,
        type: type
    }
    data.objects.push(obj)
    console.log('added')
    hide(document.getElementById('leftClick'))
}
document.addEventListener('keyup', (e)=>{
    if (e.keyCode == 32) {
        objectMode()
    }
})
async function back() {
    await writeFileSync(mapPath, JSON.stringify(data))
    history.back()
}
async function forward() {
    await writeFileSync(mapPath, JSON.stringify(data))
    history.forward()
}
function changeBackground() {
    var input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()
    input.addEventListener('change', ()=>{
        // copy image and set it from appData
        var source = input.files[0].path
        var dest = join(tempPath, 'map.png')
        copyFile(source, dest, (err) => {
            if (err) throw err;
            console.log(`${source} was copied to ${dest}`);
        })
        input.remove()
        document.location.reload()
    })
}

function hideGrid() {
    var elements = document.querySelectorAll('.elem')
    elements.forEach(elem =>{
        elem.classList.add('nogrid')
    })
}
function showGrid() {
    var elements = document.querySelectorAll('.elem')
    elements.forEach(elem =>{
        elem.classList.remove('nogrid')
    })
}