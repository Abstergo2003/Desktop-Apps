const {readFileSync} = window.fs
const {readFile} = window.fs
const {writeFileSync} = window.fs
let __dirname
const join = window.path.join
var variables
let options
var GameLog
window.electron.ipcRenderer.send('askPath');
window.electron.ipcRenderer.on('userData', (event, userData)=>{
    console.log('returned')
    __dirname = userData
    variables = JSON.parse(readFileSync(join(__dirname, 'saveToLoad.json'), 'utf-8'))
    GameLog = variables.logs
    options = JSON.parse(readFileSync(join(__dirname, 'options.json'), 'utf-8'))
    loadChat()
    if (variables.temp.path != undefined) {
        console.log('path defined')
        mapLoaderImg()
    }
    if (variables.temp.step != undefined) {
        console.log('step defined')
        document.documentElement.style.setProperty('--step', variables.temp.step + "px")
        mapLoaderNet()
    }
    optionsPath = userData + '\\options.json'
    console.log(optionsPath)
    options = JSON.parse(readFileSync(optionsPath, 'utf-8'))
})
var isMoving = false
var target
var isFocused = false
var isFocused2 = false
var toastCounter = 0
function loadMobs() {
    var mobsList = document.getElementById('mobs')
    mobsList.innerHTML = ''
    var select = document.getElementById('enemy-to-attack')
    select.innerHTML = ''
    var healSelect = document.getElementById('healingSelect')
    healSelect.innerHTML = ''
    var mobs = variables.temp.mobs
    for (var i = 0; i<mobs.length; i++) {
        mobsList.innerHTML += `
        <div id="${mobs[i].id}" class="mob">
            <img src="img/creatures/${mobs[i].type}.png">
            <span>${mobs[i].name}</span> <a>${mobs[i].ac}</a>
            <div class="outer"><div class="inner" id="${mobs[i].id}hp"></div></div>
        </div>`
        console.log(mobs[i].id+'hp')
        width = 100 - Math.floor(mobs[i].currentHP / mobs[i].maxHP * 100 )
        document.getElementById(mobs[i].id+'hp').style.width = width + '%'
        select.innerHTML += `<option id="${mobs[i].id}" value="${mobs[i].id}">${mobs[i].name}</option>`
        healSelect.innerHTML += `<option id="${mobs[i].id}" value="${mobs[i].id}">${mobs[i].name}</option>`
        AddEnemyAvatar(variables.temp.mobs[i])
    }
}
function loadPlayers() {
    for (var i = 0; i<variables.temp.players.length; i++) {
        addAvatar(variables.temp.players[i])
    }
}
function TriggerAddMob() {
    document.getElementById('add-enemy-form').style.left = '500px'
    isFocused = true
}
function AddMob() {
    if (document.getElementById('name').value == "") {
        return 0
    }
    if (document.getElementById('type').value == "") {
        return 0
    }
    if (document.getElementById('maxhp').value == "") {
        return 0
    }
    if (document.getElementById('currenthp').value == "") {
        return 0
    }
    if (document.getElementById('ac').value == "") {
        return 0
    }
    if (document.getElementById('pos-x').value == "") {
        return 0
    }
    if (document.getElementById('pos-y').value == "") {
        return 0
    }
    obj = {
        "type" : document.getElementById('type').value,
        "name" : document.getElementById('name').value,
        "ac": document.getElementById('ac').valueAsNumber,
        "maxHP" : document.getElementById('maxhp').valueAsNumber,
        "currentHP": document.getElementById('currenthp').valueAsNumber,
        "id": Math.floor(Math.random()* 1000) + 1,
        "positionX": document.getElementById('pos-x').valueAsNumber,
        "positionY": document.getElementById('pos-y').valueAsNumber
    }
    variables.temp.mobs.push(obj)
    CancellAddMob()
    loadMobs()
    var healSelect = document.getElementById('healingSelect')
    healSelect.innerHTML += `<option vaule="${obj.id}">${obj.name}</option>`
    var msg = `added new mob: ${obj.name}, ${obj.type}`
    saveMessage(0, msg)
    socket.emit('new-enemy', obj)
    AddEnemyAvatar(obj, variables.temp.mobs.length-1)
}
function CancellAddMob() {
    document.getElementById('add-enemy-form').style.left = '-1000px'
    document.getElementById('type').value = ""
    document.getElementById('name').value = ""
    document.getElementById('ac').value = ""
    document.getElementById('maxhp').value = ""
    document.getElementById('currenthp').value = ""
    isFocused = false
}
function TriggerAttackMob() {
    document.getElementById('attack-form').style.left = '500px'
    isFocused = true
}
function AttackMob() {
    var enemy
    var id = document.getElementById('enemy-to-attack').value
    console.log(id)
    for (var i = 0; i<variables.temp.mobs.length; i++) {
        if (variables.temp.mobs[i].id == id) {
            enemy = variables.temp.mobs[i]
            console.log(enemy)
        }
    }
    var hit = 0
    var d4count = document.getElementById('Hd4').valueAsNumber
    var d6count = document.getElementById('Hd6').valueAsNumber
    var d8count = document.getElementById('Hd8').valueAsNumber
    var d10count = document.getElementById('Hd10').valueAsNumber
    var d12count = document.getElementById('Hd12').valueAsNumber
    var d20count = document.getElementById('Hd20').valueAsNumber
    for (var i = 0; i<d4count; i++) {
        hit = hit + dice(4)
    }
    for (var i = 0; i<d6count; i++) {
        hit = hit + dice(6)
    }
    for (var i = 0; i<d8count; i++) {
        hit = hit + dice(8)
    }
    for (var i = 0; i<d10count; i++) {
        hit = hit + dice(10)
    }
    for (var i = 0; i<d12count; i++) {
        hit = hit + dice(12)
    }
    for (var i = 0; i<d20count; i++) {
        hit = hit + dice(20)
    }
    console.log(hit)
    var dmg = 0
    if (hit > enemy.ac) {
        console.log("attacking")
        var d4count = document.getElementById('Dd4').valueAsNumber
        var d6count = document.getElementById('Dd6').valueAsNumber
        var d8count = document.getElementById('Dd8').valueAsNumber
        var d10count = document.getElementById('Dd10').valueAsNumber
        var d12count = document.getElementById('Dd12').valueAsNumber
        var d20count = document.getElementById('Dd20').valueAsNumber
        for (var i = 0; i<d4count; i++) {
            dmg = dmg + dice(4)
        }
        for (var i = 0; i<d6count; i++) {
            dmg = dmg + dice(6)
        }
        for (var i = 0; i<d8count; i++) {
            dmg = dmg + dice(8)
        }
        for (var i = 0; i<d10count; i++) {
            dmg = dmg + dice(10)
        }
        for (var i = 0; i<d12count; i++) {
            dmg = dmg + dice(12)
        }
        for (var i = 0; i<d20count; i++) {
            dmg = dmg + dice(20)
        }
        console.log(dmg)
        enemy.currentHP -= dmg
        console.log(enemy.currentHP)
        width = 100 - Math.floor(enemy.currentHP / enemy.maxHP * 100 )
        document.getElementById(id+'hp').style.width = width + "%"
        if (enemy.currentHP < 0) {
            document.getElementById(id).remove()
            document.getElementById(enemy.name).remove()
            document.getElementById(enemy.id).remove()
        }
    }
    CancellAttackMob()
    var msg = `player diced ${hit} for hit, and did ${dmg} damage to ${enemy.name}`
    saveMessage(0, msg)
    socket.emit('attack', variables.temp.mobs)
}
function CancellAttackMob() {
    document.getElementById('attack-form').style.left = '-1000px'
    isFocused = false
}
function TriggerJustDice(){
    document.getElementById('JustDice').style.left = '500px'
    isFocused = true
}
function JustDice() {
    var hit = 0
    var d4count = document.getElementById('Jd4').valueAsNumber
    var d6count = document.getElementById('Jd6').valueAsNumber
    var d8count = document.getElementById('Jd8').valueAsNumber
    var d10count = document.getElementById('Jd10').valueAsNumber
    var d12count = document.getElementById('Jd12').valueAsNumber
    var d20count = document.getElementById('Jd20').valueAsNumber
    for (var i = 0; i<d4count; i++) {
        hit = hit + dice(4)
    }
    for (var i = 0; i<d6count; i++) {
        hit = hit + dice(6)
    }
    for (var i = 0; i<d8count; i++) {
        hit = hit + dice(8)
    }
    for (var i = 0; i<d10count; i++) {
        hit = hit + dice(10)
    }
    for (var i = 0; i<d12count; i++) {
        hit = hit + dice(12)
    }
    for (var i = 0; i<d20count; i++) {
        hit = hit + dice(20)
    }
    console.log(hit)
    var msg = `player diced with <b>${d4count}</b> d4, <b>${d6count}</b> d6, <b>${d8count}</b> d8, <b>${d10count}</b> d10, <b>${d12count}</b> d12, <b>${d20count}</b> d20, which sums up to <b>${hit}</b>`
    saveMessage(0, msg)
}
function CancellJustDice() {
    document.getElementById('JustDice').style.left = '-1000px'
    document.getElementById('Jd4').valueAsNumber = 0
    document.getElementById('Jd6').valueAsNumber = 0
    document.getElementById('Jd8').valueAsNumber = 0
    document.getElementById('Jd10').valueAsNumber = 0
    document.getElementById('Jd12').valueAsNumber = 0
    document.getElementById('Jd20').valueAsNumber = 0
    isFocused = false
}
function dice(max) {
    return Math.round(Math.random()*max + 1)
}
function setMapTrigger() {
    document.getElementById('set-image').style.left = '500px'
    isFocused = true
}
function setMapOk() {
// Create an input element of type 'file'
const inputElement = document.createElement('input');
inputElement.type = 'file';

// Add an event listener for the 'change' event when a file is selected
let base64Image
inputElement.addEventListener('change', (event) => {
  const file = event.target.files[0];

  // Create a FileReader object
  const reader = new FileReader();

  // Set the onload event handler to read the file contents
  reader.onload = (e) => {
    base64Image = e.target.result; // Get the base64 encoded image data
    console.log('Base64 image:', base64Image);
    variables.temp.path = base64Image
    var img = new Image();
    img.src = base64Image;
    document.getElementById('map').style.backgroundImage = `url('${img.src}')`
    setMapCancell()
    socket.emit('new-map', img.src)
  };

  // Read the file as Data URL
  reader.readAsDataURL(file);
});

// Trigger the file input dialog
inputElement.click();

}
function setMapCancell() {
    document.getElementById('set-image').style.left = '-500px'
    SqrNetTrigger()
}
function SqrNetTrigger() {
    var map = document.getElementById('holder')
    map.innerHTML = ''
    testnet = document.createElement('div')
    testnet.classList.add('testnet')
    testnet.setAttribute('draggable', true)
    map.append(testnet)
    document.getElementById('sqrnetbuttons').style.left = '500px'
}
function SqrNetOk() {
    variables.temp.step = document.querySelector('.testnet').offsetWidth - 1
    var dim = document.querySelector('.testnet').offsetWidth - 1 
    console.log(variables.temp.step)
    document.documentElement.style.setProperty('--step', variables.temp.step + "px")
    var map = document.getElementById('map')
    var holder = document.getElementById('holder')
    var width = map.offsetWidth
    var height = map.offsetHeight
    var count = Math.ceil(width/variables.temp.step) * Math.ceil(height/variables.temp.step) * 1.5
    console.log(count)
    console.log('adding div')
    for (var i = 0; i<count; i++) {
        testnet = document.createElement('div')
        testnet.classList.add('readynet')
        testnet.style.width = dim +'px'
        testnet.style.height = dim +'px'
        holder.append(testnet)
    }
    SqrNetCancell()
    obj = {
        "width" : dim,
        "count" : count
    }
    socket.emit('new-net', obj)
    var msg = `set sqare net, with square wall length = ${variables.temp.step}px`
    saveMessage(0, msg)
}
function SqrNetCancell() {
    document.querySelector('.testnet').remove()
    document.getElementById('sqrnetbuttons').style.left = '-500px'
    SetPosTrigger()
}
function SetPosTrigger() {
    document.getElementById('margin').style.left = '500px'
}
function SetPos() {
    console.log('mar')
    document.getElementById('holder').style.marginLeft = `${document.getElementById('marL').value-50}px`
    document.getElementById('holder').style.marginTop = `${document.getElementById('marT').value-50}px`
    variables.temp.marginL = document.getElementById('marL').value - 50
    variables.temp.marginT = document.getElementById('marT').value - 50
    //E:\archiwum\My Creations\Desktop Apps\test\views\img\map.webp
}
function SetPosCancell() {
    document.getElementById('margin').style.left = '-500px'
    obj = {
        "mL" : variables.temp.marginL,
        "mT" : variables.temp.marginT
    }
    socket.emit('new-margins', obj)
    loadPlayers()
    loadMobs()
    isFocused = false
}
function addMessage(userId, msg) {
    console.log(userId)
    var message = document.createElement('div')
    message.classList.add('message')
    message.innerHTML = msg
    document.querySelector('.msg-container').append(message)
    updateScroll()
}
function saveMessage(userId, msg) {
    var obj = {
        "author" : userId,
        "text" : msg
    }
    variables.logs.push(obj)
    addMessage(userId, msg)
    socket.emit('new-message', obj)
}
function updateScroll(){
    var element = document.querySelector('.msg-container');
    element.scrollTop = element.scrollHeight;
}
function SendMessage() {
    var msg = document.querySelector('.msg-content').value
    document.querySelector('.msg-content').value = ''
    saveMessage(0, msg)
    isFocused = false
}
function AddPlayerTrigger() {
    document.getElementById('add-player-form').style.left = '500px'
    isFocused = true
}
function AddPlayer() {
    if (document.getElementById('nameP').value == "") {
        return 0
    }
    if (document.getElementById('acP').valueAsNumber == "") {
        return 0
    }
    if (document.getElementById('maxhpP').valueAsNumber == "") {
        return 0
    }
    if (document.getElementById('currenthpP').valueAsNumber == "") {
        return 0
    }
    if (document.getElementById('pos-xP').valueAsNumber == "") {
        return 0
    }
    if (document.getElementById('pos-yP').valueAsNumber == "") {
        return 0
    }
    var obj = {
        "name": document.getElementById('nameP').value,
        "ac": document.getElementById('acP').valueAsNumber,
        "maxhp": document.getElementById('maxhpP').valueAsNumber,
        "currenthp": document.getElementById('currenthpP').valueAsNumber,
        "positionX": document.getElementById('pos-xP').valueAsNumber,
        "positionY": document.getElementById('pos-yP').valueAsNumber,
        "color" : randomColor()
    }
    variables.temp.players.push(obj)
    socket.emit('new-player', obj)
    console.log(variables.temp.players)
    AddPlayerCancell()
    var msg = `${obj.name} joined the game`
    saveMessage(0, msg)
    addAvatar(obj, variables.temp.players.length-1)
}
function AddPlayerCancell() {
    document.getElementById('add-player-form').style.left = '-500px'
    document.getElementById('maxhpP').value = ''
    document.getElementById('currenthpP').value = ''
    document.getElementById('acP').value = ''
    document.getElementById('nameP').value = ''
    document.getElementById('pos-xP').value = ''
    document.getElementById('pos-yP').value = ''
    isFocused = false
}
function addAvatar(obj) {
    if (document.getElementById(obj.name)) {
        document.getElementById(obj.name).remove()
    }
    var avatar = document.createElement('div')
    avatar.classList.add('avatarP')
    avatar.style.backgroundColor = obj.color || randomColor()
    avatar.innerText = obj.name.slice(0,1)
    console.log(variables.temp.marT + 'px')
    avatar.style.top = variables.temp.step * obj.positionY + variables.temp.marginT + 'px'
    avatar.style.left = variables.temp.step * obj.positionX + variables.temp.marginL + 'px'
    avatar.setAttribute('id', obj.name)
    document.getElementById('map').append(avatar)
    avatar.addEventListener('mouseover', (e)=>{
        var info = document.getElementById('info')
        info.style.left = e.pageX + 'px'
        info.style.top = e.pageY + 'px'
        info.innerText = e.target.id
    })
    avatar.addEventListener('mouseleave', ()=>{
        var info = document.getElementById('info')
        info.style.left = -500 + 'px'
    })
}
function AddEnemyAvatar(obj) {
    if (document.getElementById(obj.name)) {
        document.getElementById(obj.name).remove()
    }
    var enemy = document.createElement('div')
    enemy.classList.add('avatarM')
    enemy.style.backgroundColor = 'transparent'
    enemy.style.content = `url("img/creatures/${obj.type}.png")`
    enemy.style.top = variables.temp.step * obj.positionY + variables.temp.marginT + 'px'
    enemy.style.left = variables.temp.step * obj.positionX + variables.temp.marginL + 'px'
    enemy.setAttribute('id', obj.name)
    document.getElementById('map').append(enemy)
    enemy.addEventListener('mouseover', (e)=>{
        var info = document.getElementById('info')
        info.style.left = e.pageX + 'px'
        info.style.top = e.pageY + 'px'
        info.innerText = e.target.id
    })
    enemy.addEventListener('mouseleave', ()=>{
        var info = document.getElementById('info')
        info.style.left = -500 + 'px'
    })
}
function randomColor() {
    return "#" + (1 << 24 | Math.random()*255 << 16 | Math.random()*255 << 8 | Math.random()*255).toString(16).slice(1);
}
function loadChat() {
    for (var i = 0; i<GameLog.length; i++) {
        addMessage(GameLog[i].author, GameLog[i].text)
    }
}
function mapLoaderImg() {
    var img = new Image();
    img.src = variables.temp.path;
    document.getElementById('map').style.backgroundImage = `url('${img.src}')`
}
function mapLoaderNet() {
    var dim = variables.temp.step + 'px'
    var map = document.getElementById('map')
    var holder = document.getElementById('holder')
    var width = map.offsetWidth
    var height = map.offsetHeight
    var count = Math.ceil(width/variables.temp.step) * Math.ceil(height/variables.temp.step) * 1.5
    console.log(count)
    for (var i = 0; i<count; i++) {
        console.log('adding div')
        testnet = document.createElement('div')
        testnet.classList.add('readynet')
        testnet.style.width = dim
        testnet.style.height = dim
        holder.append(testnet)
    }
    loadMobs()
    loadPlayers()
}
function TriggerHeal() {
    document.getElementById('healForm').style.left = '500px'
    isFocused = true
}
function Heal() {
    var id = document.getElementById('healingSelect').value
    console.log(id)
    for (var i = 0; i<variables.temp.mobs.length; i++) {
        if (variables.temp.mobs[i].id == id) {
            enemy = variables.temp.mobs[i]
            console.log(enemy)
        }
    }
    enemy.currentHP += document.getElementById('healAm').valueAsNumber
    console.log(enemy.currentHP)
    width = 100 - Math.floor(enemy.currentHP / enemy.maxHP * 100 )
    if (width <= 0) {
        width = 0
        enemy.currentHP = enemy.maxHP
        saveMessage(0, `${enemy.name} was healed, its HP was fully restored`)
    } else {
        saveMessage(0, `${enemy.name} was healed for ${document.getElementById('healAm').value} points`)
    }
    document.getElementById(id+'hp').style.width = width + "%"
    socket.emit('heal', variables.temp.mobs)
    HealCancell()
}
function HealCancell() {
    document.getElementById('healAm').value = ''
    document.getElementById('healForm').style.left = '-1000px'
    isFocused = false
}
function toast(msg) {
    var toast = document.createElement('div')
    toast.classList.add('notification')
    toast.innerText = msg
    document.body.append(toast)
    toast.style.top = toastCounter * 8 + 'vh'
    toastCounter++
    delay(300).then(()=>{
        toast.style.left = 65 + '%'
        delay(5000).then(()=>{;
            toast.style.left = 150 + '%'
            toastCounter--
            delay(1000).then(()=>{
                toast.remove();
            })
        })
    })
}
function save() {
    var saves = JSON.parse(readFileSync(join(__dirname, 'saveTable.json'), 'utf-8'))
    if (+variables.id) {
        saves[+variables.id] = variables
    } else if (variables.id == '0') {
        saves[0] = variables
    } else if (variables.id == -1) {
        saves.push(variables)
    }
    writeFileSync(join(__dirname, 'saveTable.json'), JSON.stringify(saves))
    toast('Your game was saved succesfully. You can now exit window.')
}
document.getElementById('add-enemy').addEventListener('click', TriggerAddMob)
document.getElementById('add-enemy-ok').addEventListener('click', AddMob)
document.getElementById('add-enemy-cancell').addEventListener('click', CancellAddMob)
document.getElementById('deal-damage').addEventListener('click', TriggerAttackMob)
document.getElementById('attack-enemy-ok').addEventListener('click', AttackMob)
document.getElementById('attack-enemy-cancell').addEventListener('click', CancellAttackMob)
document.getElementById('dice').addEventListener('click', TriggerJustDice)
document.getElementById('just-dice-ok').addEventListener('click', JustDice)
document.getElementById('just-dice-cancell').addEventListener('click', CancellJustDice)
document.getElementById('set-map-trigger').addEventListener('click', setMapTrigger)
document.getElementById('set-map-ok').addEventListener('click', setMapOk)
document.getElementById('set-map-close').addEventListener('click', setMapCancell)
document.getElementById('sqrnet-ok').addEventListener('click', SqrNetOk)
document.getElementById('sqrnet-cancell').addEventListener('click', SqrNetCancell)
document.getElementById('marL').addEventListener('change', SetPos)
document.getElementById('marT').addEventListener('change', SetPos)
document.getElementById('margin-ok').addEventListener('click', SetPosCancell)
document.getElementById('send').addEventListener('click', SendMessage)
document.getElementById('addplayer').addEventListener('click', AddPlayerTrigger)
document.getElementById('add-player-ok').addEventListener('click', AddPlayer)
document.getElementById('add-player-cancell').addEventListener('click', AddPlayerCancell)
document.getElementById('heal').addEventListener('click', TriggerHeal)
document.getElementById('healOK').addEventListener('click', Heal)
document.getElementById('healCancell').addEventListener('click', HealCancell)
document.getElementById('save').addEventListener('click', save)
document.getElementById('joinLink').addEventListener('click', ()=>{
    toast(`Your room id is : ${window.location.href.slice(22,-1)}`)
})
document.getElementById('move').addEventListener('click', ()=>{
    if (isMoving == false) {
        isMoving = true
        document.getElementById('move').classList.add('clicked')
    } else {
        isMoving = false
        document.getElementById('move').classList.remove('clicked')
    }
})

document.addEventListener('click', (e)=>{
    window.electron.ipcRenderer.send('button', 'ok');
    target = e.target.id
    console.log(target)
    if (target == 'inside') {
        isFocused2 = true
    } else {
        isFocused2 = false
    }
})
document.addEventListener('keyup', (e)=>{
    e = e || window.event
    var key = e.keyCode
    if (key>=37 && key<=40) {
        if (isMoving) {
            var result = variables.temp.mobs.filter(obj => {
                return obj.name === target
            })
            var result2 = variables.temp.players.filter(obj => {
                return obj.name === target
            })
            obj = result[0] || result2[0]
            switch (key) {
                case 37 : obj.positionX--; break; //left
                case 38 : obj.positionY--; break; //up
                case 39 : obj.positionX++; break; //rigth
                case 40 : obj.positionY++; break; //down
            }
            document.getElementById(obj.name).remove()
            if (!result[0]) addAvatar(obj)
            else AddEnemyAvatar(obj)
            var msg = `${obj.name} moved`
            saveMessage(0, msg)
            socket.emit('move', obj)
        }
    } else if (key == options.addEnemy && isFocused == false && isFocused2 == false) {
        TriggerAddMob()
    } else if (key == options.attack && isFocused == false && isFocused2 == false) {
        TriggerAttackMob()
    } else if (key == options.move && isFocused == false && isFocused2 == false) {
        if (isMoving == false) {
            isMoving = true
            document.getElementById('move').classList.add('clicked')
        } else {
            isMoving = false
            document.getElementById('move').classList.remove('clicked')
        }
    } else if (key == options.dice && isFocused == false && isFocused2 == false) {
        TriggerJustDice()
    } else if (key == options.setMap && isFocused == false && isFocused2 == false) {
        setMapTrigger()
    } else if (key == options.addPlayer && isFocused == false && isFocused2 == false) {
        AddPlayerTrigger()
    }
})
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}