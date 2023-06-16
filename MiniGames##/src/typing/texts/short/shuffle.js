const fs = require('fs')

var arr = JSON.parse(fs.readFileSync('E:/archiwum/My Creations/Desktop Apps/MiniGames/src/typing/texts/short/0.json', 'utf-8'))
for (var i = 0; i < arr.length; i++) {
    let schowek = arr[i]
    let index = Math.floor(Math.random() * 70);
    arr[i] = arr[index]
    arr[index] = schowek
}

fs.writeFileSync('E:/archiwum/My Creations/Desktop Apps/MiniGames/src/typing/texts/short/0.json', JSON.stringify(arr))