function generateMaleName() {
    var holder = document.getElementById('names')
    var index1 = Math.floor(Math.random() * maleNames.length)
    holder.value += 'M: ' + maleNames[index1] + ' '
    var index2 = Math.floor(Math.random() * maleNames.length)
    holder.value += maleNames[index2] + '\n'
    updateScroll('names')
}

function generateFemaleName() {
    var holder = document.getElementById('names')
    var index1 = Math.floor(Math.random() * femaleNames.length)
    holder.value += 'F: ' + femaleNames[index1] + ' '
    var index2 = Math.floor(Math.random() * femaleNames.length)
    holder.value += femaleNames[index2] + '\n'
    updateScroll('names')
}

function generateEncounter() {
    var holder = document.getElementById('encounter')
    var index1 = Math.floor(Math.random() * enMeeting.length)
    holder.value += '(*): ' + enMeeting[index1] + ' - '
    var index2 = Math.floor(Math.random() * enPerson.length)
    holder.value += enPerson[index2] + ' - '
    var index3 = Math.floor(Math.random() * enAction.length)
    holder.value += enAction[index3] + '\n\n'
    updateScroll('encounter')
}

function generateFight() {
    var holder = document.getElementById('fight')
    var index1 = Math.floor(Math.random() * fMeeting.length)
    holder.value += '(*): ' + fMeeting[index1] + ' - '
    var index2 = Math.floor(Math.random() * fMob.length)
    holder.value += fMob[index2] + ' - '
    var index3 = Math.floor(Math.random() * fAction.length)
    holder.value += fAction[index3] + '\n\n'
    updateScroll('fight')
}

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