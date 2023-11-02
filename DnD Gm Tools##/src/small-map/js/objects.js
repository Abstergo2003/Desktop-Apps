function loadObjects() {
    var objects = data.objects
    var area = document.getElementById('area')
    for (var i = 0; i<objects.length; i++) {
        area.innerHTML += `<div id="${objects[i].id}" class="areaObject area${objects[i].type}" style="left: ${objects[i].left}px; top: ${objects[i].top}px" onmouseenter="showItem(this.id, event)" onmouseleave="document.querySelector('.info').style.left = '-1200px'"></div>`
    }
}
function updateObjects(id) {
    const isID = (obj) => obj.id == id
    var index = data.objects.findIndex(isID)
    data.objects.splice(index, 1)
}

function showItem(id, e) {
    if (isWallsMode) return 0
    var obj = data.objects.filter(obj => obj.id == id)[0]
    var container = document.querySelector('.info')
    var img = container.querySelector('img')
    var spans = container.querySelectorAll('span')
    var item = items.filter(item => item.id == obj.item)[0]
    img.src = `img/${item.type}.png`
    spans[0].innerText = item.name
    spans[1].innerText = item.rarity
    spans[1].style.color = `var(--${item.rarity})`
    spans[2].innerText = item.requirements
    container.style.left = e.clientX + 'px'
    container.style.top = e.clientY + 'px'
}
loadObjects()