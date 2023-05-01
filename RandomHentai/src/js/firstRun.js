var isFirst = localStorage.getItem('isFirst')
function setPath() {
    var variables = JSON.parse(readFileSync(VarUrl, 'utf-8'))
    variables.path = document.getElementById('path-txt').value
    writeFileSync(VarUrl, JSON.stringify(variables), 'utf-8')
    localStorage.setItem('isFirst', false)
    document.getElementById('path').style.left = '-500px'
}
if (!isFirst) {
    document.getElementById('path').style.left = '50px'
    document.getElementById('path').style.top = '200px'
    document.getElementById('path-ok').addEventListener('click', setPath)
}