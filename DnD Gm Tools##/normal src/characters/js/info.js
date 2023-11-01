let SortingBoxes = {
    playable: [],
    unPlayable: []
}

function loadType(type) {
    const types = ['playable', 'unPlayable']
    var container = document.querySelector('.list')
    container.innerHTML = ''
    for (var j = 0; j<types.length; j++) {
        for (var i = 0; i<SortingBoxes[types[j]].length; i++) {
            var item = SortingBoxes[types[j]][i]
            if (item.type == type) {
                container.innerHTML +=
                `<div class="item" id="${item.id}">
                    <span style="color: var(--${item.race})">${item.name}</span>
                    <img src="img/${item.race}.png">
                    <img src="img/${item.type}.png">
                </div>`
            }
        }
    }
}

function sortToBoxes() {
    for (var i = 0; i<items.length; i++) {
        SortingBoxes[items[i].playable].push(items[i])
    }
    return 'ok'
}

function sortBox(type) {
    console.log('sorting')
    for (var i = 0; i<SortingBoxes[type].length; i++) {
        for (var j = 0; j<SortingBoxes[type].length-1; j++) {
            var item1 = SortingBoxes[type][j]
            var item2 = SortingBoxes[type][j+1]
            if (item2.name[0].toLowerCase() < item1.name[0].toLowerCase()) {
                SortingBoxes[type][j] = item2
                SortingBoxes[type][j+1] = item1
            }
        }
    }
}

function loadRarity(playable) {
    var container = document.querySelector('.list')
    for (var i = 0; i<SortingBoxes[playable].length; i++) {
            container.innerHTML += 
            `<div class="item" id="${SortingBoxes[playable][i].id}" onclick="inpect(this.id)">
                <span style="color: var(--${SortingBoxes[playable][i].playable})">${SortingBoxes[playable][i].name}</span>
                <img src="img/${SortingBoxes[playable][i].race}.png">
                <img src="img/${SortingBoxes[playable][i].type}.png">
            </div>`
    }
}

document.querySelectorAll('.sort').forEach(item => {
    if (item.id == 'all') {
        
        item.addEventListener('click', ()=>{
            document.querySelector('.list').innerHTML = ''
            resetBoxes()
            start()
        })
    } else {
        item.addEventListener('click', ()=>{loadType(item.id)})
    }
})

function resetBoxes() {
    SortingBoxes.playable = []
    SortingBoxes.unPlayable = []
}

function start() {

    sortToBoxes();

    sortBox('playable')
    loadRarity('playable')

    sortBox('unPlayable')
    loadRarity('unPlayable')
}

function inpect(id) {
    console.log('inspect')
    var onlist = document.getElementById(id)
    if (onlist.classList[1]) {
        onlist.classList.remove('new')
    }
    var item = items.filter(item => item.id == id)[0]
    if (item.hasICON) {
        document.getElementById('inspectICON').src = ''
    } else {
        document.getElementById('inspectICON').src = `img/${item.race}.png`
    }
    document.getElementById('inspectName').value = item.name
    document.getElementById('inspectWealth').value = item.wealth
    document.getElementById('inspectType').value = item.type
    document.getElementById('inspectType').style.color = `var(--${item.playable})`
    document.getElementById('inspectRace').value = item.race
    document.getElementById('inspectAlignment').value = item.alignment
    document.getElementById('inspectTrait').value = item.trait
    document.getElementById('inspectDescription').value = item.description
    localStorage.setItem('currentCharacter', id)
}

function updateInfo(id) {
    var change = id.replace('inspect', '').toLowerCase()
    var characterID = localStorage.getItem('currentCharacter')
    const isID = (character) => character.id == characterID
    const index = items.findIndex(isID)
    var value = document.getElementById(id).value
    items[index][change] = value
    if (change == 'race') {
        var isPlayable = playable.indexOf(value)
        if (isPlayable != -1) {
            items[index].playable = 'playable'
        } else {
            items[index].playable = 'unPlayable'
        }
    }
}

start()
var inputs = document.querySelectorAll('input')
inputs.forEach(input => {
    input.addEventListener('input', ()=>{
        updateInfo(input.id)
    })
})

document.querySelector('textarea').addEventListener('input', ()=>{
    updateInfo("inspectDescription")
})

document.getElementById('inspectRace').addEventListener('input', ()=>{
    updateInfo('inspectRace')
})

document.getElementById("inspectType").addEventListener('input', ()=>{
    updateInfo("inspectType")
})