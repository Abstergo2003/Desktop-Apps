function inspect(id) {
    var character = characters.filter((char)=> char.id == id)[0]
    document.getElementById('stats-img').src = `./img/${character.type}.png`
    document.getElementById('stats-name').value = character.name
    document.getElementById('stats-ac').value = character.ac
    document.getElementById('stats-init').value = character.init
    document.getElementById('currentHealth').value = character.health.current
    document.getElementById('maxHealth').value = character.health.total
    document.getElementById('stats-health-indicator').style.width = Math.round(character.health.current / character.health.total * 100) + '%'
    document.getElementById('stats-defense').value = character.defense
    document.getElementById('stats-offense').value = character.offense
    document.getElementById('stats-other').value = character.other
    sessionStorage.setItem('currentInspect', id)
}

document.getElementById('stats-name').addEventListener('input', ()=>{
    var id = sessionStorage.getItem('currentInspect')
    var result = characters.filter((char)=> char.id == id)[0]
    var value = document.getElementById('stats-name').value
    result.name = value
    document.getElementById(id).querySelector('td').innerText = value
})
document.getElementById('stats-ac').addEventListener('input', ()=>{
    var id = sessionStorage.getItem('currentInspect')
    var result = characters.filter((char)=> char.id == id)[0]
    var value = document.getElementById('stats-ac').value
    result.ac = value
    document.getElementById(id).querySelector('.character-ac').innerText = value
})
document.getElementById('stats-init').addEventListener('input', ()=>{
    var id = sessionStorage.getItem('currentInspect')
    var result = characters.filter((char)=> char.id == id)[0]
    var value = document.getElementById('stats-init').value
    result.init = value
    document.getElementById(id).querySelector('.character-init').innerHTML = value + '<img src="img/initiative.png">'
})
document.getElementById('currentHealth').addEventListener('input', ()=>{
    var id = sessionStorage.getItem('currentInspect')
    var result = characters.filter((char)=> char.id == id)[0]
    var value = document.getElementById('currentHealth').value
    result.health.current = value
    document.getElementById('stats-health-indicator').style.width = Math.round(value / result.health.total * 100) + '%'
    document.getElementById(id).querySelector('.outer').querySelector('span').innerText = `${value}/${result.health.total}`
    document.getElementById(id).querySelector('.inner').style.width = Math.round(value / result.health.total * 100) + '%'
})
document.getElementById('maxHealth').addEventListener('input', ()=>{
    var id = sessionStorage.getItem('currentInspect')
    var result = characters.filter((char)=> char.id == id)[0]
    result.health.total = document.getElementById('maxHealth').value
    var value = document.getElementById('maxHealth').value
    result.health.total = value
    document.getElementById('stats-health-indicator').style.width = Math.round(result.health.current / value * 100) + '%'
    document.getElementById(id).querySelector('.outer').querySelector('span').innerText = `${result.health.current}/${value}`
    document.getElementById(id).querySelector('.inner').style.width = Math.round(result.health.current / value * 100) + '%'
})
document.getElementById('stats-defense').addEventListener('input', ()=>{
    var id = sessionStorage.getItem('currentInspect')
    var result = characters.filter((char)=> char.id == id)[0]
    result.defense = document.getElementById('stats-defense').value
})
document.getElementById('stats-offense').addEventListener('input', ()=>{
    var id = sessionStorage.getItem('currentInspect')
    var result = characters.filter((char)=> char.id == id)[0]
    result.offense = document.getElementById('stats-offense').value
})
document.getElementById('stats-other').addEventListener('input', ()=>{
    var id = sessionStorage.getItem('currentInspect')
    var result = characters.filter((char)=> char.id == id)[0]
    result.other = document.getElementById('stats-other').value
})
document.getElementById('stats-img').addEventListener('click', ()=>{
    document.querySelector('.typeChooser').style.left = '600px'
    document.querySelector('.typeChooser').style.top = '50px'
})
document.querySelector('.typeChooser').querySelectorAll('img').forEach(img =>{
    img.addEventListener('click', ()=>{
        var id = sessionStorage.getItem('currentInspect')
        var result = characters.filter((char)=> char.id == id)[0]
        var type = img.getAttribute('type')
        result.type = type
        document.getElementById('stats-img').src = `./img/${type}.png`
        document.getElementById(id).querySelector('.type').style.backgroundImage = `url(./img/${type}.png)`
        hide(document.querySelector('.typeChooser'))
    })
})