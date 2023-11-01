function hide(element) {
    element.style.left = '-2000px'
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

async function back() {
    await writeFileSync(tempPath, JSON.stringify(items))
    history.back()
}
async function forward() {
    await writeFileSync(tempPath, JSON.stringify(items))
    history.forward()
}

function addCharacter() {
    const date = new Date()
    const timestamp = date.getTime()
    var obj = {
        "name": "Some Character",
        "wealth": "20cc",
        "type": "enemy",
        "id": timestamp,
        "race": "beast",
        "alignment": "neutral",
        "trait": "none",
        "description": "does +5 slashing damage",
        "hasICON": false,
        "playable": "unPlayable"
    }
    items.push(obj)
    SortingBoxes.unPlayable.push(obj)
    var container = document.querySelector('.list')
    container.innerHTML +=
        `<div class="item new" id="${obj.id}" onclick="inpect(this.id)">
            <span style="color: var(--${obj.playable})">${obj.name}</span>
            <img src="img/${obj.race}.png">
            <img src="img/${obj.type}.png">
        </div>`
    hide(document.getElementById('leftClick'))
}
function removeCharacter() {
    if (target.classList[0] != 'item') {
        target = target.parentNode
        if (target.classList[0] != 'item') {
            console.log('wrong target')
            return 0
        }
    }
    const isID = (item) => item.id == target.id
    const index = items.findIndex(isID)
    items.splice(index, 1)
    target.remove()
    hide(document.getElementById('leftClick'))
}