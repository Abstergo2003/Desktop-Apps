const {readFileSync} = window.fs
const {writeFileSync} = window.fs
const VarUrl = window.path.variables
const coversPath = window.path.cover
var variables = JSON.parse(readFileSync(VarUrl, 'utf-8'))
var FavHolder = document.getElementById('FavHolder')
const loadFav = ()=> {
    for (var i = 0; i<variables.favourites.length; i++) {
        FavHolder.innerHTML += `<div class="container"><img src="${coversPath+'/'+variables.favourites[i].id+'.jpg'}"><h3>${variables.favourites[i].title}</h3><br><br><br><div id="${1000+i}" class="button" style="content: url(img/saved.svg);"></div><div id="${i}" class="button fav" style="content: url(img/unfav.svg)"></div></div>`
    }
}
loadFav()
document.addEventListener('click', (e)=> {
    let id = e.target.id
    if (id == '0') {
        variables.favourites.splice(+id,1)
        writeFileSync(VarUrl, JSON.stringify(variables), 'utf-8')
        FavHolder.innerHTML =''
        loadFav()
    } else if(+id) {
        variables.favourites.splice(+id,1)
        writeFileSync(VarUrl, JSON.stringify(variables), 'utf-8')
        FavHolder.innerHTML =''
        loadFav()
    }
})