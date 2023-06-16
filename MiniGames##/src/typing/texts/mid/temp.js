const fs = require('fs')
var titles = []
for (var i = 0; i<20; i++) {
    var text = JSON.parse(fs.readFileSync(`E:/archiwum/My Creations/Desktop Apps/MiniGames/src/typing/texts/mid/${i}.json`, 'utf-8'))
    titles.push(text.title)
}
fs.writeFileSync(`E:/archiwum/My Creations/Desktop Apps/MiniGames/src/typing/texts/mid/titles.json`, JSON.stringify(titles))