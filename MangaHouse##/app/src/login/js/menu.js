var email
var accountHolder = document.querySelector('.accounts')
var accounts = [{"nick" : "Abstergo", "email": "radek_korszla@o2.pl"}, {"nick" : "Kamil", "email": "kamil_zareba@o2.pl"}];
document.addEventListener('click', (e)=>{
    let id = e.target.id
    if (id == '0') {
        console.log('account 0')
        document.querySelector('.saved-login').style.height = '65vh'
        email = accounts[0].email
    } else if (+id) {
        console.log('account' + +id)
        document.querySelector('.saved-login').style.height = '65vh'
        email = accounts[+id].email
    }
})
function loadSavedAccounts() {
    for (var i = 0; i<accounts.length; i++) {
        accountHolder.innerHTML += `
        <div class="account" id="${i}">
            <img src="img/avatar.png" id="${i}"><br>
            <span id="${i}">${accounts[i].nick}</span>
        </div>`
    }
}
function preSavedLogin() {
    var password = document.getElementById('other-password').value
    if (password == '') {
        console.log('no password')
        return 0
    }
    console.log('Logging with:' + email + '&' + password)
    login(email, password)
}
function preLoginWithNewAccount() {
    var email2 = document.getElementById('new-email').value
    var password = document.getElementById('new-password').value
    if (email2 == '') {
        console.log('no email')
        return 0
    }
    if (email2.indexOf('@') == -1) {
        console.log('wrong email')
        return 0
    }
    if (email2.indexOf('.') == -1) {
        console.log('wrong email')
        return 0
    }
    if (password == '') {
        console.log('no password')
        return 0
    }
    console.log('logging with new account: ' + email2 + ' & ' + password)
    var obj = {
        "login" : "new-login",
        "email": email2
    }
    accounts.push(obj)
    console.log(accounts)
    login(email2, password)
}
function preRegister() {
    var nick = document.getElementById('register-nick').value
    var email2 = document.getElementById('register-email').value
    var password = document.getElementById('register-password').value
    for (var i = 0; i<accounts.length; i++) {
        if (email2 == accounts[i].email) {
            console.log('email already registered')
            return 0
        }
        if (nick == accounts[i].nick) {
            console.log('nick already taken')
            return 0
        }
    }
    if (emailChecker(email2) == false) {
        console.log('incorrect email')
        return 0
    }
    if (passwordChacker(password) == false) {
        console.log('incorrect password')
        return 0
    }
    var obj = {
        "nick": nick,
        "email": email2
    }
    accounts.push(obj)
    console.log(accounts)
    console.log('registering new account with: nick: ' + nick + ', email: ' + email2 + ',password: ' + password)
    register(nick, email2, password)
}
function emailChecker(obj) {
    if (obj.indexOf('@') == -1) {
        return false
    }
    if (obj.indexOf('.') == -1) {
        return false
    }
    return true
}
function passwordChacker(obj) {
    if (obj.search(/\d/) == -1) {
        return false
    }
    if (obj.search(/[A-Z]/) == -1) {
        return false
    }
    if (obj.search(/[^\w\s]/g) == -1) {
        return false
    }
    return true
}
document.getElementById('other').addEventListener('click', ()=>{
    document.querySelector('.saved-login').style.height = '0vh'
    document.getElementById('other-password').value = ''
})
document.getElementById('other-login').addEventListener('click', preSavedLogin)
document.getElementById('new-login').addEventListener('click', preLoginWithNewAccount)
document.getElementById('register').addEventListener('click', preRegister)
loadSavedAccounts()
