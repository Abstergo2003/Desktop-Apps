async function load() {
    var holder = document.querySelector('.holder')
    for (obj in data) {
        obj = data[obj]
        console.log(obj.target)
        const icon = await getIcon(obj.id)
        holder.innerHTML += 
            `<div class="icon" id="${obj.id}" >
                <img src="data:image/jpeg;base64,${icon}" onclick="determineAction('${obj.target}', event)"><br>
                <input value="${obj.name}">
            </div>`
    }
    holder.innerHTML += 
        `<div class="icon safe" onclick="addFile()">
            <img src="img/add.svg" style="filter: invert(95%) sepia(94%) saturate(26%) hue-rotate(355deg) brightness(106%) contrast(107%);"><br>
        </div>`
}

function determineAction(target, event) {
    if (isCtrl) {
        deleteShortcut(event.target)
    } else {
        openF(target)
    }
}

async function openF(target) {
    const exists = await existsSync(target)
    if (!exists) {
        target = target.replaceAll(' (x86)', '')
    }
    exec(`start "" "${target}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
        }
        console.log('File opened successfully');
    });
}

function addFile() {
    var input = document.createElement('input')
    window.electron.ipcRenderer.send('cantQuit');
    input.setAttribute('type', 'file')
    input.setAttribute('accept', '.lnk')
    input.click()
    input.addEventListener('change', ()=>{
        // copy image and set it from appData
        const type = input.files[0].type
        if (type != '') return 0
        const source = input.files[0].path
        let name = input.files[0].name
        name = name.slice(0, name.lastIndexOf('.'))
        wsquery(source, function(error, properties) {
            const target = properties.target.replaceAll('\\', '/')
            window.electron.ipcRenderer.send('getIcon', target);
            const date = new Date()
            const timestamp = date.getTime()
            obj = {
                "name": name,
                "target": target,
                "id": timestamp
            }
            data.push(obj)
            save()
        })
        input.remove()
        window.electron.ipcRenderer.send('canQuit');
    })
}

document.addEventListener('input', ()=>{
    clearTimeout(typingTimer);

    // Set a new timer
    typingTimer = setTimeout(function() {
        console.log('stopped typing saving data')
        var shortcuts = document.querySelectorAll('.icon')
        for (const sc of shortcuts) {
            if (sc.classList[1] == 'safe') return 0
            const isID = (elem) => elem.id == sc.id;
            const index = data.findIndex(isID)
            data[index].name = sc.querySelector('input').value
            save()
        }
    }, doneTypingInterval);
})



async function updateIcon(source, id) {
    const base64 = await readFileSync(source, {encoding: 'base64'})
    console.log(base64)
    await writeFileSync(savesPath + `\\icons\\${id}.txt`, base64)
    document.location.reload()
}

function deleteShortcut(target) {
    if (target.classList[0] != 'icon' || target.classList[1] == 'safe') {
        target = target.parentNode
        if (target.classList[0] != 'icon' || target.classList[1] == 'safe') return 0
    }
    const ID = target.id
    const isID = (elem) => elem.id == ID;
    const index = data.findIndex(isID)
    data.splice(index, 1)
    save()
    target.remove()
}

document.addEventListener('keydown', (e)=>{
    if (e.keyCode != 17) return 0
    isCtrl = true
})

document.addEventListener('keyup', (e)=>{
    if (e.keyCode != 17) return 0
    isCtrl = false
})

document.addEventListener('contextmenu', (e)=>{
    e.preventDefault()
    var target = e.target
    if (target.classList[0] != 'icon' || target.classList[1] == 'safe') {
        target = target.parentNode
        if (target.classList[0] != 'icon' || target.classList[1] == 'safe') return 0
    } 
    var input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', '.jpg, .jpeg, .png')
    window.electron.ipcRenderer.send('cantQuit');
    input.click()
    input.addEventListener('change', ()=>{
        const source = input.files[0].path
        updateIcon(source, target.id)
        input.remove()
        window.electron.ipcRenderer.send('canQuit');
    })
})

async function getIconFromFile(iconPath) {
    const base64 = await readFileSync(iconPath, {encoding: 'base64'})
    const id = data[data.length-1].id
    await writeFileSync(savesPath+`\\icons\\${id}.txt`, base64)
    document.location.reload()
} 
load()