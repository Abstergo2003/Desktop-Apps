const {readFileSync} = window.fs
var discover = ['random title 1', 'random title 1', 'random title 1', 'random title 1']
var availible = []
var account = JSON.parse(sessionStorage.getItem('accountDATA'))
for (var p = 0; p<account.subscriptions.length; p++) {
    console.log('pushing')
    availible.push(account.subscriptions[p].id)
}
var contin = []
//for (var q = 0; q<account.newChapters.length; q++) {
 //   contin.push(account.newChapters[q].id)
//}
sessionStorage.setItem('type', 'manga')
function load() {
    var dHolder = document.getElementById('discover')
    var aHolder = document.getElementById('availible')
    var cHolder = document.getElementById('ontinue')
    for (var i = 0; i < discover.length; i++) {
        dHolder.innerHTML += `
        <a href="../blog/index.html">
        <div class="content" id="${'d'+i}">
            <img src="img/test.jpg" id="${'d'+i}">
            <span id="${'d'+i}">${discover[i]}</span> 
        </div>
        </a>`
    }
    for (var j = 0; j < availible.length; j++) {
        var manga = JSON.parse(readFileSync(`E:/archiwum/My Creations/Desktop Apps/Storage/manga/${availible[j]}/data.json`, 'utf-8'))
        aHolder.innerHTML += `
        <a href="../blog/index.html">
        <div class="content" id="${'a'+availible[j]}">
            <img src="E:/archiwum/My Creations/Desktop Apps/Storage/manga/${availible[j]}/cover.webp" id="${'a'+availible[j]}">
            <span id="${'a'+availible[j]}">${manga.title}</span>
        </div>
        </a>`
    }
    for (var k = 0; k < contin.length; k++) {
        var manga2 = JSON.parse(readFileSync(`E:/archiwum/My Creations/Desktop Apps/Storage/manga/${contin[k]}/data.json`, 'utf-8'))
        cHolder.innerHTML += `
        <a href="../blog/index.html">
        <div class="content" id="${'c'+k}">
            <img src="E:/archiwum/My Creations/Desktop Apps/Storage/manga/${contin[k]}/cover.webp" id="${'c'+k}">
            <span id="${'c'+k}">${manga2.title}</span>
        </div>
        </a>`
    }
}
document.addEventListener('click', (e)=>{
    let id = e.target.id
    console.log(id)
    if (id[0] == 'd') {
        console.log('discovery')
    } else if (id[0] == 'a') {
        console.log('availible')
        sessionStorage.setItem('toRead', id.slice(1))
    } else if (id[0] == 'c') {
        console.log('continue')
    }
})
load()