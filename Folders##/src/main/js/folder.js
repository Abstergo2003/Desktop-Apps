async function addFolder() {
    const date = new Date()
    const timestamp = date.getTime()
    obj = {
        id: timestamp,
        name: "New Folder"
    }
    data.push(obj)
    await writeFileSync(savesPath + '\\folders.json', JSON.stringify(data))
    await writeFileSync(savesPath + `\\icons\\${timestamp}.txt`, defaultFolderIcon)
    await writeFileSync(savesPath + `\\folders\\${timestamp}.json`, '[]')
    document.location.reload()
}

function determineAction(target, event) {
    console.log(isCtrl)
    if (isCtrl) {
        deleteShortcut(event.target)
    } else {
        console.log('opening')
        openFolder(event.target)
    }
}

async function openFolder(target) {
    if (target.classList[0] != 'icon' || target.classList[1] == 'safe') {
        target = target.parentNode
        if (target.classList[0] != 'icon' || target.classList[1] == 'safe') return 0
    }
    localStorage.setItem('folderID', target.id)
    window.electron.ipcRenderer.send('openFolder');
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
    input.click()
    input.addEventListener('change', ()=>{
        const source = input.files[0].path
        updateIcon(source, target.id)
        input.remove()
    })
})

async function deleteShortcut(target) {
    if (target.classList[0] != 'icon' || target.classList[1] == 'safe') {
        target = target.parentNode
        if (target.classList[0] != 'icon' || target.classList[1] == 'safe') return 0
    }
    const ID = target.id
    const isID = (elem) => elem.id == ID;
    const index = data.findIndex(isID)
    data.splice(index, 1)
    await writeFileSync(savesPath + '\\folders.json', JSON.stringify(data))
    target.remove()
}
async function updateIcon(source, id) {
    const base64 = await readFileSync(source, {encoding: 'base64'})
    await writeFileSync(savesPath + `\\icons\\${id}.txt`, base64)
    document.location.reload()
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
            writeFileSync(savesPath + '\\folders.json', JSON.stringify(data))
        }
    }, doneTypingInterval);
})