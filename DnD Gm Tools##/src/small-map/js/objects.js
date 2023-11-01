function loadObjects() {
    var objects = data.objects
    var area = document.getElementById('area')
    for (var i = 0; i<objects.length; i++) {
        area.innerHTML += `<div class="areaObject area${objects[i].type}" style="left: ${objects[i].left}px; top: ${objects[i].top}px"></div>`
    }
}
function updateObjects(id) {
    const isID = (obj) => obj.id == id
    var index = data.objects.findIndex(isID)
    data.objects.splice(index, 1)
}
loadObjects()