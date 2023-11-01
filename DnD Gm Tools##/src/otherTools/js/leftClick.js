function hide(element) {
    element.style.left = '-2000px'
    var options = element.querySelectorAll('.option')
    options.forEach(option => {
        option.remove()
    });
    var inputs  = element.querySelectorAll('input')
    inputs.forEach(input => {
        input.remove()
    })
}

document.addEventListener('contextmenu',(e) =>  {
    e.preventDefault()
    clickX = e.pageX
    clickY = e.pageY
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
    history.back()
}
async function forward() {
    history.forward()
}
