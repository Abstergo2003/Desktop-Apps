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

function addItem() {
    const date = new Date()
    const timestamp = date.getTime()
    var obj = {
        "name": "Random Name",
        "cost": "20cc",
        "type": "other",
        "id": timestamp,
        "rarity": "common",
        "attune": "no need",
        "requirements": "none",
        "description": "none",
        "hasICON": false
    }
    items.push(obj)
    SortingBoxes.common.push(obj)
    var container = document.querySelector('.list')
    container.innerHTML += 
        `<div class="item new" id="${obj.id}" onclick="inpect(this.id)">
            <span style="color: var(--${obj.rarity})">${obj.name}</span>
            <span tag="cost">${obj.cost}</span>
            <img src="img/${obj.type}.png">
        </div>`
    hide(document.getElementById('leftClick'))
}
function removeItem() {
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