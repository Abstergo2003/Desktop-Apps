function loadCharacters(array) {
    var holder = document.querySelector('.tracker')
    for (var i = 0; i <array.length; i++) {
        var char = array[i]
        holder.innerHTML += `
                <div class="character" onclick="inspect(this.id)" id="${char.id}">
                    <div class="type" style="background-image: url(img/${char.type}.png)"></div>
                    <table>
                        <tr>
                            <td>${char.name}</td>
                        </tr>
                        <tr>
                            <td>
                                <div class="outer">
                                    <span>${char.health.current}/${char.health.total}</span>
                                    <div class="inner" style="width: ${char.health.current/char.health.total * 100}%"></div>
                                </div>
                            </td>
                        </tr>
                    </table>
                    <div class="character-ac">${char.ac}</div>
                    <div class="character-init">${char.init}<img src="img/initiative.png"></div>
                </div>`
    }
}
function addCharacter() {
    var name = document.getElementById('add-character-name').value
    const date = new Date()
    const timestamp = date.getTime()
    var arr = []
    var obj = {
        type: "monster",
        name: name,
        health: {
            current: 0,
            total: 0
        },
        ac: 0,
        init: 0,
        id: timestamp,
        defense: '',
        offense: '',
        other: ''
    }
    arr.push(obj)
    characters.push(obj)
    loadCharacters(arr)
    sessionStorage.setItem('currentInspect', timestamp)
    inspect(timestamp)
}
function rollInit(array) {
    var includePlayers = document.getElementById('includePlayers').checked
    console.log(includePlayers)
    if (includePlayers) {
        for (var i = 0; i<array.length; i++) {
            var init = Math.round(Math.random() * 19 + 1)
            array[i].init = init;
        }
    } else {
        for (var i = 0; i<array.length; i++) {
            if (array[i].type != 'player') {
                var init = Math.round(Math.random() * 19 + 1)
                array[i].init = init;
            }
        }
    }
    document.querySelector('.tracker').innerHTML = '<form action="" onsubmit="addCharacter()"><input type="text" placeholder="Add your character here..." id="add-character-name"></form>'
    loadCharacters(array)
}
function sortByInit(array) {
    console.log('begin sorting')
    for (var j = 0; j<array.length; j++) {
        console.log(i + 'run')
        for (var i = 0; i <array.length-1; i++) {
            console.log(i + '+'+ (i+1) + 'elemts')
            if (array[i].init < array[i+1].init) {
                var schowek = array[i]
                array[i] = array[i+1]
                array[i+1] = schowek
            }
        }
    }
    characters = array
    document.querySelector('.tracker').innerHTML = '<form action="" onsubmit="addCharacter()"><input type="text" placeholder="Add your character here..." id="add-character-name"></form>'
    loadCharacters(array)
}
function tourHandling() {
    console.log('handling tour')
    var array = document.querySelectorAll('.character')
    for (var i = 0; i<array.length; i++) {
        array[i].classList.remove('tour')
    }
    if (tour == array.length) {
        tour = 0
    }
    array[tour].classList.add('tour')
    tour++
}
function include(elem) {
    if (elem.checked) {
        document.querySelector('.tracker-options').querySelector('span').style.textDecoration = 'none'
    } else {
        document.querySelector('.tracker-options').querySelector('span').style.textDecoration = 'line-through'
    }
}
loadCharacters(characters)