socket.on('attack', mobs=>{
    variables.temp.mobs = mobs
    console.log('mob was attacked')
    var mobsList = document.getElementById('mobs')
    var avatars = document.querySelectorAll('.avatarM')
    var select = document.getElementById('enemy-to-attack')
    select.innerHTML = ''
    for (var j = 0; j<avatars.length; j++) {
        avatars[j].remove()
    }
    mobsList.innerHTML = ''
    for (var i = 0; i<mobs.length; i++) {
        if(mobs[i].currentHP > 0) {
            mobsList.innerHTML += `
            <div id="${mobs[i].id}" class="mob">
                <img src="img/${mobs[i].type}.png">
                <span>${mobs[i].name}</span> <a>${mobs[i].ac}</a>
                <div class="outer"><div class="inner" id="${mobs[i].id}hp"></div></div>
            </div>`
            console.log(mobs[i].id+'hp')
            width = 100 - Math.floor(mobs[i].currentHP / mobs[i].maxHP * 100 )
            document.getElementById(mobs[i].id+'hp').style.width = width + '%'
            select.innerHTML += `<option id="${mobs[i].id}" value="${mobs[i].id}">${mobs[i].name}</option>`
            AddEnemyAvatar(variables.temp.mobs[i])
        }
    }
})
socket.on('move', obj=>{
    console.log('moving')
    avatar = document.getElementById(obj.name)
    avatar.style.top = variables.temp.step * obj.positionY + variables.temp.marginT + 'px'
    avatar.style.left = variables.temp.step * obj.positionX + variables.temp.marginL + 'px'
    var result = variables.temp.mobs.filter(mob=>{
        return mob.name == obj.name
    })
    console.log(result[0])
    result[0].positionX = obj.positionX
    result[0].positionY = obj.positionY
})
socket.on('new-enemy', obj=>{
    var healSelect = document.getElementById('healingSelect')
    healSelect.innerHTML += `<option value="${obj.id}">${obj.name}</option>`
    variables.temp.mobs.push(obj)
    var mobList = document.getElementById('mobs')
    mobList.innerHTML += `
    <div id="${obj.id}" class="mob">
        <img src="img/creatures/${obj.type}.png">
        <span>${obj.name}</span> <a>${obj.ac}</a>
        <div class="outer"><div class="inner" id="${obj.id}hp"></div></div>
    </div>`
    AddEnemyAvatar(obj)
})
socket.on('new-player', obj=>{
    variables.temp.players.push(obj)
    addAvatar(obj)
})
socket.on('new-message', obj=>{
    variables.logs.push(obj)
    var message = document.createElement('div')
    message.classList.add('message')
    message.innerHTML = obj.text
    document.querySelector('.msg-container').append(message)
    updateScroll()
})
socket.on('heal', mobs=>{
    variables.temp.mobs = mobs
    var mobsList = document.getElementById('mobs')
    mobsList.innerHTML = ''
    for (var i = 0; i<mobs.length; i++) {
        if(mobs[i].currentHP > 0) {
            mobsList.innerHTML += `
            <div id="${mobs[i].id}" class="mob">
                <img src="img/${mobs[i].type}.png">
                <span>${mobs[i].name}</span> <a>${mobs[i].ac}</a>
                <div class="outer"><div class="inner" id="${mobs[i].id}hp"></div></div>
            </div>`
            console.log(mobs[i].id+'hp')
            width = 100 - Math.floor(mobs[i].currentHP / mobs[i].maxHP * 100 )
            document.getElementById(mobs[i].id+'hp').style.width = width + '%'
        }
    }
})
socket.on('new-map', src=>{
    document.getElementById('map').style.backgroundImage = `url('${src}')`
    variables.temp.path = src
})
socket.on('new-net', obj=>{
    document.documentElement.style.setProperty('--step', variables.temp.step + "px")
    variables.temp.step = obj.width
    var holder = document.getElementById('holder')
    holder.innerHTML = ''
    for (var i = 0; i<obj.count; i++) {
        testnet = document.createElement('div')
        testnet.classList.add('readynet')
        testnet.style.width = obj.width +'px'
        testnet.style.height = obj.width +'px'
        holder.append(testnet)
    }
    var avatars = document.querySelectorAll('.avatarP')
    for (var j = 0; j<avatars.length; j++) {
        avatars[j].remove
    }
    var avatarsE = document.querySelectorAll('.avatarM')
    for (var j = 0; j<avatarsE.length; j++) {
        avatarsE[j].remove
    }
    loadPlayers()
    for (var k = 0; k<variables.temp.mobs.length; k++) {
        AddEnemyAvatar(variables.temp.mobs[k])
    }
})
socket.on('new-margins', obj=>{
    variables.temp.marginL = obj.mL
    variables.temp.marginT = obj.mT
    document.getElementById('holder').style.marginLeft = `${obj.mL}px`
    document.getElementById('holder').style.marginTop = `${obj.mT}px`
    var avatars = document.querySelectorAll('.avatarP')
    for (var j = 0; j<avatars.length; j++) {
        avatars[j].remove
    }
    var avatarsE = document.querySelectorAll('.avatarM')
    for (var j = 0; j<avatarsE.length; j++) {
        avatarsE[j].remove
    }
    loadPlayers()
    for (var k = 0; k<variables.temp.mobs.length; k++) {
        AddEnemyAvatar(variables.temp.mobs[k])
    }
})