//moving functions

document.querySelector('.area').addEventListener('mousedown', (e)=>{
    isDown = true
    target = e.target
})
document.querySelector('.area').addEventListener('mouseup', ()=>{
    isDown = false
})
document.querySelector('.area').addEventListener('mouseleave', ()=>{
    isDown = false
})
document.addEventListener('mousemove', (e)=> {
    if (!isDown) return 0
    if (target.classList[0] != 'areaObject' && target.classList[0] != 'cv') return 0
    if (target.getAttribute('movable') != 'true') return 0
    var left = e.clientX - areaPosition.x
    var top = e.clientY - areaPosition.y
    if (left < 0 || left > areaPosition.width) return 0
    if (top < 0 || top > areaPosition.height) return 0
    var result = objects.filter(obj => obj.id == target.id)[0]
    result.top = top
    result.left = left
    target.style.left = left + 'px'
    target.style.top = top + 'px'
})

async function defineSize(elem) {
    var leftSpans = document.querySelector('.leftPanel').querySelectorAll('span')
    var topSpans = document.querySelector('.topPanel').querySelectorAll('span')
    var rightSpans = document.querySelector('.rightPanel').querySelectorAll('span')
    var bottomSpans = document.querySelector('.bottomPanel').querySelectorAll('span')
    step = (elem.valueAsNumber / 20)
    for (var i = 19; i > -1; i--) {
        leftSpans[i].innerText = `${((20 - i) * step).toFixed(1)}`
    }
    for (var i = 19; i > -1; i--) {
        topSpans[i].innerText = `${((20 - i) * step).toFixed(1)}`
    }
    for (var i = 19; i > -1; i--) {
        rightSpans[i].innerText = `${((20 - i) * step).toFixed(1)}`
    }
    for (var i = 19; i > -1; i--) {
        bottomSpans[i].innerText = `${((20 - i) * step).toFixed(1)}`
    }
    calculateSize()
    hide(document.getElementById('leftClick'))
}

function calculateSize() {
    var areaSize = document.querySelector('.area').offsetHeight
    var size = areaSize / (step * 20)
    var objects = document.querySelector('.area').querySelectorAll('.areaObject')
    objects.forEach(obj => {
        console.log(obj)
        if (obj.classList[1] == 'areaBoss') {
            obj.style.width = parseInt(size*1.5)  + 'px'
            obj.style.height = parseInt(size*1.5) + 'px'
        } else {
            obj.style.width = parseInt(size) + 'px'
            obj.style.height = parseInt(size) + 'px'
        }
    })
    var canvases = document.querySelector('.area').querySelectorAll('canvas')
    canvases.forEach(canvas =>{
        canvas.style.width = parseInt(size * 5) + 'px'
        canvas.style.height = parseInt(size * 5) + 'px'
    })
    data.size = size
}

const startDrawing = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX
    prevMouseY = e.offsetY
    ctx.beginPath()
    ctx.lineWidth = 5;
    ctx.strokeStyle = strokeColor
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}

const drawing = (e) => {
    console.log(isDrawing)
    if(!isDrawing) return 0
    ctx.putImageData(snapshot, 0, 0)
    //draw line
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.stroke()
}

function loadArea() {
    var holder = document.querySelector('.area')
    for (var i = 0; i<objects.length; i++) {
        var obj = objects[i]
        if (obj.type != 'canvas') {
            var elem = document.createElement('div')
            elem.classList.add('areaObject')
            elem.classList.add(`area${obj.type}`)
            if (obj.type == 'Boss') {
                elem.style.height = parseInt(data.size * 1.5) + 'px'
                elem.style.width = parseInt(data.size * 1.5) + 'px'
            } else {
                elem.style.height = parseInt(data.size) + 'px'
                elem.style.width = parseInt(data.size) + 'px'
            }
            elem.style.left = obj.left + 'px'
            elem.style.top = obj.top + 'px'
            elem.id = obj.id
            elem.setAttribute('movable', true)
            holder.append(elem)
        } else {
            var elem = document.createElement('canvas')
            elem.classList.add('cv')
            elem.id = obj.id
            elem.style.top = obj.top + 'px'
            elem.style.left = obj.left + 'px'
            elem.style.width = parseInt(data.size *5) + 'px'
            elem.style.height = parseInt(data.size *5) + 'px'
            elem.setAttribute('movable', true)
            holder.append(elem)
            var ctx = elem.getContext('2d')
            var image = new Image();
            image.onload = function() {
                ctx.drawImage(image, 0, 0);
            };
            image.src = obj.imgData
            elem.width = elem.offsetWidth
            elem.height = elem.offsetHeight
        }
    }
}

loadArea()