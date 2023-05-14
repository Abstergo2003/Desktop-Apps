const {readFileSync} = window.fs
var ProductID = +sessionStorage.getItem('toRead')
var manga = JSON.parse(readFileSync(`E:/archiwum/My Creations/Desktop Apps/Storage/manga/${ProductID}/data.json`, 'utf-8'))
var blog = JSON.parse(readFileSync(`E:/archiwum/My Creations/Desktop Apps/Storage/manga/${ProductID}/blog.json`, 'utf-8'))
sessionStorage.setItem('type', manga.type)
function switchView1() {
    document.getElementById('info').style.height = 0
    document.getElementById('chapters').style.height = 'min-content'
}
function switchView2() {
    document.getElementById('info').style.height = 'min-content'
    document.getElementById('chapters').style.height = 0
}
function load() {
    //loading title
    document.getElementById('data-title').innerText = manga.title.toUpperCase()
    document.getElementById('cover').src = `E:/archiwum/My Creations/Desktop Apps/Storage/manga/${ProductID}/cover.webp`
    var infoh = document.getElementById('infoh')
    var blogh = document.querySelector('.comments')
    //loading description
    infoh.innerHTML += `<span>${manga.description}</span><br>`
    // loading tags
    for (var i = 0; i<manga.chapters.length; i++) {
        infoh.innerHTML += `<span class="tag">${manga.tags[i]}</span>`
    }
    // loading various other info
    infoh.innerHTML += `<br>
        <span class="tag tag2">Chapters: ${manga.chapters.length}</span><br>
        <span class="tag tag2">Status : ${manga.status}</span><br>
        <span class="tag tag2">Last Update : ${manga.lastUpdate}</span><br>
        <span class="tag tag2">Release Type : ${manga.releaseType}</span><br>
        <span class="tag tag2">Author : ${manga.author}</span><br>
        <span class="tag tag2">${manga.notes}</span><br>`
    // loading comments
    for (var j = 0; j<blog.length; j++) {
        var sect = document.createElement('section')
        sect.setAttribute('id', blog[j].id)
        sect.innerHTML += `<div class="comment">
        <img src="img/avatar.png">
        <span>${blog[j].text}</span><br>
        <p>${blog[j].date}</p>
        <a href="" onclick="return false" style="float: right;">Response</a>
        </div>`
        // adding responses to created section
        for (var k = 0; k<blog[j].responses.length; k++) {
            sect.innerHTML += `<div class="comment response">
            <img src="img/avatar.png">
            <span>${blog[j].responses[k].text}</span><br>
            <p>${blog[j].responses[k].date}</p>
            </div>`
        }
        //appending section
        blogh.append(sect)
    }
    //loading chapters
    var chapters = document.getElementById('chapters')
    for (var l = 0; l<manga.chapters.length; l++) {
        chapters.innerHTML += `
        <a href="../read/index.html" id="${l}">
            <div class="chapter" id="${l}">
                <span id="${l}"><b>Chapter: ${l}</b>, ${manga.chapters[l].title}</span><br>
                <p id="${l}">${manga.chapters[l].releaseDate}</p>
            </div>
        </a>`
    }
    document.querySelectorAll('.button')[1].setAttribute('id', manga.chapters.length-1)
}
load()
document.addEventListener('click', (e)=>{
    let id = e.target.id
    if (id == '0') {
        sessionStorage.setItem('chapter', 0)
    } else if (+id) {
        sessionStorage.setItem('chapter', +id)
    }
})