async function load() {
    console.log("started");
    var holder = document.querySelector('.holder')
    const data = await getData()
    for (obj of data) {
        console.log(obj.target);
        const icon = await getIcon(obj.id);
        loadElement(holder, obj, icon);
        await delay(300);
    }
}

function loadElement(holder, obj, icon) {
    if (obj.special != undefined) {
        let iconHolder = document.createElement("div");
        iconHolder.classList.add("iconHolder");

        let iconDiv = document.createElement("div");
        iconDiv.classList.add("icon");
        iconDiv.classList.add("nodelete");
        iconDiv.id = obj.id;
        let img = document.createElement("img");
        img.src = `data:image/jpeg;base64,${icon}`;
        img.addEventListener("click", ()=>{
            determineAction(`${obj.id}.lnk`, event, obj.special);
        })
        img.id = obj.id;
        let input = document.createElement("input");
        input.value = obj.name;

        iconDiv.append(img);
        iconDiv.append(input);

        iconHolder.append(iconDiv);

        holder.append(iconHolder);
    } else {
        let iconHolder = document.createElement("div");
        iconHolder.classList.add("iconHolder");

        let iconDiv = document.createElement("div");
        iconDiv.classList.add("icon");
        iconDiv.id = obj.id;
        let img = document.createElement("img");
        img.src = `data:image/jpeg;base64,${icon}`;
        img.addEventListener("click", ()=>{
            determineAction(`${obj.id}.lnk`, event, obj.special);
        })
        img.id = obj.id;

        let input = document.createElement("input");
        input.value = obj.name;

        iconDiv.append(img);
        iconDiv.append(input);

        iconHolder.append(iconDiv);

        holder.append(iconHolder);
    }
}

function determineAction(target, event, special) {
    if (isCtrl) {
        deleteShortcut(event.target);
    } else if (special != undefined){
        specialCommand(special);
    } else {
        openF(target);
    }
}

function specialCommand(special) {
    invoke('run_command', {command: special})
}

async function openF(target) {
    const path = await window.__TAURI__.path.appLocalDataDir();
    console.log(`start "${path}\\items\\${target}"`);
    await invoke('run_command', {command: `start "${path}\\items\\${target}"`})
}

async function addFile(target) {
    if (target.indexOf(".lnk") == -1) {
        return 0;
    }
    console.log("adding");
    const date = new Date()
    const timestamp = date.getTime()
    const lastIndexS = target.lastIndexOf('\\')
    obj = {
        "name": target.slice(lastIndexS + 1).slice(0, target.slice(lastIndexS + 1).indexOf('.')),
        "id": timestamp
    }
    console.log(JSON.stringify(obj));
    await copyFile(target, `items\\${timestamp}.lnk`, {toPathBaseDir: BaseDirectory.AppLocalData});
    console.log("copied");
    let data = await getData();
    data.push(obj)
    await save(data)
    console.log("saved data");
    try {
        let icon = await invoke('get_icon', {path: target});
        console.log("icon got");
        await remove(target);
        console.log("removed");
        await saveIcon(icon, timestamp);
        console.log("saved icon");
        let holder = document.querySelector(".holder");
        loadElement(holder, obj, icon);
    } catch (error) {
        let icon = await getIcon();
        console.log("icon got");
        await remove(target);
        console.log("removed");
        let holder = document.querySelector(".holder");
        loadElement(holder, obj, icon);
    }
}

document.addEventListener('input', ()=>{
    clearTimeout(typingTimer);
    // Set a new timer
    typingTimer = setTimeout(function() {
        console.log('stopped typing saving data')
        updateFile()
    }, doneTypingInterval);
})
async function updateFile() {
    var shortcuts = document.querySelectorAll('.icon')
    let data = await getData()
    for (const sc of shortcuts) {
        if (sc.classList[1] === 'safe') continue;  // Skip this iteration if the class is 'safe'
        const isID = (elem) => +elem.id === +sc.id;
        const index = data.findIndex(isID);
        data[index].name = sc.querySelector('input').value;
    }
    save(data)
}   

async function updateIcon(id) {
    canQuit = false
    const target = await open({
        multiple: false,
        filters: [{
            name: 'Images',
            extensions: ['png', 'jpeg', 'jpg']
        }]
    })
    console.log(target)
    if (target == null) {
        canQuit = true
        return 0
    }
    const base64 = await invoke('read_png_as_base64', {filePath: target})
    await writeTextFile(`icons\\${id}.txt`, base64, {dir: BaseDirectory.AppLocalData})
    reload()
}

async function deleteShortcut(target) {
    if (target.classList[0] != 'icon' || target.classList[1] == 'safe' || target.classList[1] == 'nodelete') {
        target = target.parentNode
        if (target.classList[0] != 'icon' || target.classList[1] == 'safe' || target.classList[1] == 'nodelete') return 0
    }
    let data = await getData()
    const ID = target.id
    const isID = (elem) => elem.id == ID;
    const index = data.findIndex(isID);
    data.splice(index, 1);
    save(data);
    remove(`items\\${ID}.lnk`, {baseDir: BaseDirectory.AppLocalData});
    remove(`icons\\${ID}.txt`, {baseDir: BaseDirectory.AppLocalData});
    target.remove();
}

document.addEventListener('keydown', (e)=>{
    if (e.keyCode == 17) {
        isCtrl = true;
    } else if (e.keyCode == 27){
        window.__TAURI__.window.getCurrentWindow().close();
    }

})

document.addEventListener('keyup', (e)=>{
    if (e.keyCode == 17) {
        isCtrl = false;
    }

})

document.addEventListener('contextmenu', (e)=>{
    e.preventDefault()
    var target = e.target
    if (target.classList[0] != 'icon' || target.classList[1] == 'safe') {
        target = target.parentNode
        if (target.classList[0] != 'icon' || target.classList[1] == 'safe') return 0
    }

    updateIcon(target.id)
})

//async function getIconFromFile() {
//    const data = await getData()
//    const id = data[data.length-1].id
//    await writeTextFile(`icons\\${id}.txt`, defaultIcon, {dir: BaseDirectory.AppLocalData})
//    document.location.reload()
//}

document.addEventListener("appReady", ()=> {
    load();
})