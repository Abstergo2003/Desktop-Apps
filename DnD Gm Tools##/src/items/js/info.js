let SortingBoxes = {
    common: [],
    uncommon: [],
    rare: [],
    veryRare: [],
    legendary: [],
    artifact: [],
    unique: [],
}

function loadType(type) {
    const types = ['common', 'uncommon', 'rare', 'veryRare', 'legendary', 'artifact', 'unique']
    var container = document.querySelector('.list')
    container.innerHTML = ''
    for (var j = 0; j<types.length; j++) {
        for (var i = 0; i<SortingBoxes[types[j]].length; i++) {
            var item = SortingBoxes[types[j]][i]
            if (item.type == type) {
                container.innerHTML += 
                `<div class="item" id="${item.id}">
                    <span style="color: var(--${item.rarity})">${item.name}</span>
                    <span tag="cost">${item.cost}</span>
                    <img src="img/${item.type}.png">
                </div>`
            }
        }
    }
}

function sortToBoxes() {
    for (var i = 0; i<items.length; i++) {
        SortingBoxes[items[i].rarity].push(items[i])
    }
    return 'ok'
}

function sortBox(type) {
    for (var i = 0; i<SortingBoxes[type].length; i++) {
        for (var i = 0; i<SortingBoxes[type].length-1; i++) {
            var item1 = SortingBoxes[type][i]
            var item2 = SortingBoxes[type][i+1]
            if (item2.name[0].toLowerCase() < item1.name[0].toLowerCase()) {
                SortingBoxes[type][i] = item2
                SortingBoxes[type][i+1] = item1
            }
        }
    }
}

function loadRarity(rarity) {
    var container = document.querySelector('.list')
    for (var i = 0; i<SortingBoxes[rarity].length; i++) {
            container.innerHTML += 
            `<div class="item" id="${SortingBoxes[rarity][i].id}" onclick="inpect(this.id)">
                <span style="color: var(--${SortingBoxes[rarity][i].rarity})">${SortingBoxes[rarity][i].name}</span>
                <span tag="cost">${SortingBoxes[rarity][i].cost}</span>
                <img src="img/${SortingBoxes[rarity][i].type}.png">
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
    SortingBoxes.common = []
    SortingBoxes.uncommon = []
    SortingBoxes.rare = []
    SortingBoxes.veryRare = []
    SortingBoxes.legendary = []
    SortingBoxes.artifact = []
    SortingBoxes.unique = []
}

function start() {
    // get data

    sortToBoxes();

    sortBox('common')
    loadRarity('common')

    sortBox('uncommon')
    loadRarity('uncommon')

    sortBox('rare')
    loadRarity('rare')

    sortBox('veryRare')
    loadRarity('veryRare')

    sortBox('legendary')
    loadRarity('legendary')

    sortBox('artifact')
    loadRarity('artifact')

    sortBox('unique')
    loadRarity('unique')
}

function inpect(id) {
    var onList = document.getElementById(id)
    if(onList.classList[1]) {
        onList.classList.remove('new')
    }
    var item = items.filter(item => item.id == id)[0]
    if (item.hasICON) {
        document.getElementById('inspectICON').src = ''
    } else {
        document.getElementById('inspectICON').src = `img/${item.type}.png`
    }
    document.getElementById('inspectName').value = item.name
    document.getElementById('inspectCost').value = item.cost
    document.getElementById('inspectRarity').value = item.rarity
    document.getElementById('inspectRarity').style.color = `var(--${item.rarity})`
    document.getElementById('inspectType').value = item.type
    document.getElementById('inspectRequirements').value = item.requirements
    document.getElementById('inspectAttune').value = item.attune
    document.getElementById('inspectDescription').value = item.description
    localStorage.setItem('currentItem', id)
}
start()

function updateInfo(id) {
    var itemID = localStorage.getItem('currentItem')
    var item = items.filter(item => item.id == itemID)[0]
    var change = id.replaceAll('inspect', '').toLowerCase()
    item[change] = document.getElementById(id).value
}

var inputs = document.querySelectorAll('input')
inputs.forEach(input => {
    input.addEventListener('input', () => {
        updateInfo(input.id)
    })
})

document.querySelector('textarea').addEventListener('input', ()=>{
    updateInfo("inspectDescription")
})

document.getElementById('inspectRarity').addEventListener('input', ()=>{
    updateInfo('inspectRarity')
})

document.getElementById("inspectType").addEventListener('input', ()=>{
    updateInfo("inspectType")
})