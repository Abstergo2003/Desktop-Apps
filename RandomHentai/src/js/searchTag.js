const {readFileSync} = window.fs
const {writeFileSync} = window.fs
const TagUrl = window.path.tags
let userDataPath
let VarUrl
let coversPath
window.electron.ipcRenderer.send('askPath');
window.electron.ipcRenderer.on('userData',function (event, userData) {
	userDataPath = userData
	VarUrl = userData + '/variables.json'
	coversPath = userData
    loadTags()
})
let result
var TagFile = readFileSync(TagUrl, 'utf-8', function(err, data){
    console.log(data)
})
var VariablesFile = readFileSync(VarUrl, 'utf-8', function(err, data){
    console.log(data)
})
var variables = JSON.parse(VariablesFile)
console.log(variables)
var tags = JSON.parse(TagFile)
const search = () =>{
    var filter = document.getElementsByTagName('textarea')[0].value
    result = tags.find(element => element >= filter)
    document.getElementById('resultHolder').innerHTML = `<div class="tag" id="select">${result}</div>`
}
const loadTags = () =>{
    console.log('loading tags')
    var holder = document.getElementById('tagHolder')
    holder.innerHTML = ''
    for (var i = 0; i<variables.tags.length; i++) {
        holder.innerHTML += `<div class="tag" id="${i}">${variables.tags[i]}</div>`
    }
}
document.getElementsByTagName('textarea')[0].addEventListener('keyup', search)
document.addEventListener('click', (e)=>{
    let id = e.target.id
    if (id == "select") {
        document.getElementById('tagHolder').innerHTML += `<div class="tag" id="${variables.tags.length}">${result}</div>`
        variables.tags.push(result)
        writeFileSync(VarUrl, JSON.stringify(variables), 'utf-8')
    } else if (+id) {
        variables.tags.splice(+id, 1)
        writeFileSync(VarUrl, JSON.stringify(variables), 'utf-8')
        loadTags()
    }
})