function dice(max) {
    var dice = Math.round(Math.random() * (max - 1)) + 1
    if (dice == max) {
        document.getElementById('dice').innerHTML += `&#9733; ${dice} // ${max} &#9733;\n`
    } else if (dice == 1) {
        document.getElementById('dice').innerHTML += `&#186; ${dice} // ${max} &#186;\n`
    } else {
        document.getElementById('dice').innerHTML += `${dice} // ${max}\n`
    }
    updateScroll('dice')
}

function diceCustom() {
    var max = Math.abs(document.querySelector('input').value)
    var dice = Math.round(Math.random() * (max - 1)) + 1
    if (dice == max) {
        document.getElementById('dice').innerHTML += `&#9733; ${dice} // ${max} &#9733;\n`
    } else if (dice == 1) {
        document.getElementById('dice').innerHTML += `&#186; ${dice} // ${max} &#186;\n`
    } else {
        document.getElementById('dice').innerHTML += `${dice} // ${max}\n`
    }
    updateScroll('dice')
}

function updateScroll(id){
    var element = document.getElementById(id);
    element.scrollTop = element.scrollHeight;
}