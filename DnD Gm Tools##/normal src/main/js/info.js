const {readFileSync, writeFileSync, copyFile} = window.fs
const {join} = window.path
const savesPath = localStorage.getItem('savesPath')
const currentSave = localStorage.getItem('currentSave')
let path2 = savesPath + '\\' + currentSave + '\\' + 'main.json'
let data = JSON.parse(readFileSync(path2, 'utf-8'))
function loadINFO() {
    document.getElementById('title').value = data.title
    document.getElementById('location').value = data.location
    document.getElementById('villain').value = data.villain
    document.getElementById('overallQuest').value = data.overallQuest
    document.getElementById('currentQuest').value = data.currentQuest
    document.getElementById('currentSession').value = data.currentSession
    document.getElementById('expectedSessions').value = data.expectedSessions
    document.getElementById('description').value = data.description
    if (data.hasICON) {
        let img = join(savesPath, currentSave, 'icon.png')
        const contents = readFileSync(img, {encoding: 'base64'});
        document.querySelector('img').src = `data:image/jpeg;base64,${contents}`
    }
}

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', (event)=>{
        data[input.id] = input.value
    })
})

document.getElementById('description').addEventListener('input', ()=>{
    data.description = document.getElementById('description').value
})

document.querySelector('img').addEventListener('click', ()=>{
    var input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()
    input.addEventListener('change', ()=>{
        // copy image and set it from appData
        var source = input.files[0].path
        var dest = join(savesPath, currentSave, 'icon.png')
        copyFile(source, dest, (err) => {
            if (err) throw err;
            data.hasICON = true
            console.log(`${source} was copied to ${dest}`);
            save()
        })
        input.remove()
        document.location.reload()
    })
})

async function back() {
    await writeFileSync(path2, JSON.stringify(data))
    history.back()
}

async function forward() {
    await writeFileSync(path2, JSON.stringify(data))
    history.forward()
}

loadINFO()