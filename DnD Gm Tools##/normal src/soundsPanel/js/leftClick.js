var target
function hide(element) {
    element.style.left = '-2000px'
}

document.addEventListener('contextmenu',(e) =>  {
    e.preventDefault()
    clickArea = e.target.id
    target = e.target
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

async function playAsMain() {
    if (target.getAttribute('path').indexOf('../') == -1) {
        var base64 = await readFileSync(target.getAttribute('path'), {encoding: 'base64'})
        document.getElementById('main').src = `data:audio/mp3;base64,${base64}`
        document.getElementById('mainName').innerText = target.innerText
    } else {
        document.getElementById('main').src = target.getAttribute('path')
        document.getElementById('mainName').innerText = target.innerText
    }
    hide(document.getElementById('leftClick'))
}

async function playAsSub() {
    if (target.getAttribute('path').indexOf('../') == -1) {
        var base64 = await readFileSync(target.getAttribute('path'), {encoding: 'base64'})
        document.getElementById('sub').src = `data:audio/mp3;base64,${base64}`
        document.getElementById('subName').innerText = target.innerText
    } else {
        document.getElementById('sub').src = target.getAttribute('path')
        document.getElementById('subName').innerText = target.innerText
    }
    hide(document.getElementById('leftClick'))
}