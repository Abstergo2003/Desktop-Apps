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
    Ltarget = parent(e.target)
    clickX = e.pageX
    clickY = e.pageY
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
    const date = new Date()
    const timestamp = date.getTime()
    var obj = {
        name: 'undefined',
        id: timestamp,
        type: type.toLowerCase(),
        mark: {type: null},
        position: {
            x: clickX,
            y: clickY
        }
    }
    data.push(obj)
    var holder = document.querySelector('.wrapper')
    var elem = `
        <div class="object" id="${obj.id}" type="${obj.type}" style="left: ${obj.position.x}px; top: ${obj.position.y}px" onclick="setSubMap('${obj.mark}')">
            <img src="img/${obj.type}.png"><br>
            <input type"text" value="${obj.name}" oninput="update(${obj.id})">
        </div>`
    holder.innerHTML += elem
    
    console.log('added')
    hide(document.getElementById('leftClick'))
}

function deleteFromMap() {
    if (Ltarget.classList[0] != 'object') return 0
    const isID = (element) => element.id == Ltarget.id;
    const index = data.findIndex(isID)
    data.splice(index, 1)
    Ltarget.remove()
    hide(document.getElementById('leftClick'))
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
    var quick = []
    for (var i = 0; i< data.length; i++) {
        quick.push(data[i].name)
    }
    await writeFileSync(tempPath, JSON.stringify(data))
    await writeFileSync(quickLoactionsPath, JSON.stringify(quick))
    history.back()
}
async function forward() {
    var quick = []
    for (var i = 0; i< data.length; i++) {
        quick.push(data[i].name)
    }
    await writeFileSync(tempPath, JSON.stringify(data))
    await writeFileSync(quickLoactionsPath, JSON.stringify(quick))
    history.forward()
}

function changeBackgroundImage() {
    var input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()
    input.addEventListener('change', ()=>{
        var source = input.files[0].path
        var dest = join(savesPath, currentSave, 'map.png')
        copyFile(source, dest, (err) => {
            if (err) throw err;
            console.log(`${source} was copied to ${dest}`);
        })
        input.remove()
        document.location.reload()
    })
}
async function createSubMap(type) {
    if (Ltarget.classList[0] != 'object') return 0
    const date = new Date()
    const timestamp = date.getTime()
    await mkdir(subMaps + `\\${timestamp}`, (err)=>{
        if (err) {
            console.log(err)
        } else {
            console.log('succesfully created')
        }
    })
    if (type == 'B') {
        writeFileSync(subMaps + `\\${timestamp}\\map.json`, '[]')
    } else {
        writeFileSync(subMaps + `\\${timestamp}\\map.json`, '{"walls": [], "objects": []}')
    }
    var source = join(dirname, 'map', 'img', 'floor.webp')
    var dest = join(subMaps, timestamp.toString(), 'map.png')
    copyFile(source, dest, (err)=>{
        if (err) throw err;
        console.log(`${source} was copied to ${dest}`);
    })
    const obj = {
        type: type,
        id: timestamp
    }
    var result = data.filter(obj => obj.id == Ltarget.id)[0]
    result.mark = obj
    await writeFileSync(tempPath, JSON.stringify(data))
    location.reload()
}