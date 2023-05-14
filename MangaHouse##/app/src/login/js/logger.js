const {readFileSync, writeFileSync} = window.fs
var account = JSON.parse(readFileSync('E:/archiwum/My Creations/Desktop Apps/Storage/accounts/data/515151/sensitive.json', 'utf-8'))
var data = JSON.parse(readFileSync('E:/archiwum/My Creations/Desktop Apps/Storage/accounts/data/515151/casual.json', 'utf-8'))
function login(email, password) {
    if (email != account.email) {
        console.log('wrong email')
        return 0
    }
    if (password != account.password) {
        console.log('wrong password')
        return 0
    }
    sessionStorage.setItem('accountDATA', JSON.stringify(data))
    //login script
    window.location.href = '../main/index.html'
}
function register(nick, email, password) {
    //register script
    window.location.href = '../main/index.html'
}