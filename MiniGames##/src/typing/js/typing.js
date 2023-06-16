const {readFileSync} = window.fs
const {dirn} = window.path
var type = sessionStorage.getItem('type')
var progress = 0//localStorage.getItem('progress')
if (type =='short') {
    var text = JSON.parse(readFileSync(dirn+`/typing/texts/${type}/0.json`, 'utf-8'))
    var quote = text[progress].text
} else {
    var text = JSON.parse(readFileSync(dirn+`/typing/texts/${type}/${progress}.json`, 'utf-8'))
    var quote = text.text
}
var isStart = false
const isNumeric = true
var isFirst = true
var counter = 0
var seconds = 0;
var minutes = 0;
var tens = 0;
var Interval;
var appendTens = document.getElementById("tens")
var appendSeconds = document.getElementById("seconds")
var appendMinutes = document.getElementById('minutes')
var codes =  {
    " " : 32,
    "0" : 48,
    "1" : 49,
    "2" : 50,
    "3" : 51,
    "4" : 52,
    "5" : 53,
    "6" : 54,
    "7" : 55,
    "8" : 56,
    "9" : 57,
    "a" : 65,
    "b" : 66,
    "c" : 67,
    "d" : 68,
    "e" : 69,
    "f" : 70,
    "g" : 71,
    "h" : 72,
    "i" : 73,
    "j" : 74,
    "k" : 75,
    "l" : 76,
    "m" : 77,
    "n" : 78,
    "o" : 79,
    "p" : 80,
    "q" : 81,
    "r" : 82,
    "s" : 83,
    "t" : 84,
    "u" : 85,
    "v" : 86,
    "w" : 87,
    "x" : 88,
    "y" : 89,
    "z" : 90,
    "num0" : 96,
    "num1" : 97,
    "num2" : 98,
    "num3" : 99,
    "num4" : 100,
    "num5" : 101,
    "num6" : 102,
    "num7" : 103,
    "num8" : 104,
    "num9" : 105,
    "num*" : 106,
    "num+" : 107,
    "num-" : 109,
    "num." : 110,
    "num/" : 111,
    ";" : 186,
    "=" : 187,
    "," : 188,
    "-" : 189,
    "." : 190,
    "/" : 191,
    " ~" : 192,
    "{" : 219,
    "|" : 220,
    "}" : 221,
    "'" : 222
}
var Coded = toKeys(quote)

function loadCards() {
    var holder = document.querySelector('.choose')
    if (type == 'short') {
        for (var i = 0; i<text.length; i++) {
            holder.innerHTML += `<div class="card" id="${i}">${text[i].text}</div>`
        }
    } else {
        var titles = JSON.parse(readFileSync(dirn+`/typing/texts/${type}/titles.json`, 'utf-8'))
        for (var i = 0; i<titles.length; i++) {
            holder.innerHTML += `<div class="card bigger" id="${i}">${titles[i]}</div>`
        }
    }
}

function toKeys(string) {
    var keys = []
    for (var i = 0; i<string.length; i++) {
        keys.push(codes[string[i].toLowerCase()])
    }
    return keys
}

function appendQuote(obj) {
    var string = obj.text
    var holder = document.getElementById('str-holder')
    for (var j = 0; j<string.length; j++) {
        holder.innerHTML += `<span id="${j}"><b>${string[j]}</b></span>`
    }
    if (type == 'short') {
        holder.innerHTML += `<p><b>${obj.author}</b></p>`
    } else  if (type == 'mid'){
        holder.innerHTML += `<p><b>"${obj.title}" by: ${obj.author}</b></p>`
        var spans = document.querySelector('#str-holder').querySelectorAll('span')
        spans.forEach(span=>{
            span.classList.add('smaller')
        })
    } else {
        holder.innerHTML += `<p><b>"${obj.title}" by: ${obj.author}</b></p>`
        var spans = document.querySelector('#str-holder').querySelectorAll('span')
        spans.forEach(span=>{
            span.classList.add('smallest')
        })
    }
}

function checkKey(key) {
    if (!isStart) {
        return 0
    }
    if (Coded[counter] == key) {
        console.log('correct')
        correct()
        counter++
    } else {
        fail()
        //fail()
    }
    if (counter == Coded.length) {
        console.log('done')
        end()
    }
}

function stoper() {
    tens++; 
    if(tens <= 9){
        appendTens.innerHTML = "0" + tens;
    }
    
    if (tens > 9){
        appendTens.innerHTML = tens;
    } 
    
    if (tens > 99) {
        console.log("seconds");
        seconds++;
        appendSeconds.innerHTML = "0" + seconds;
        tens = 0;
        appendTens.innerHTML = "0" + 0;
    }
    
    if (seconds > 9){
        appendSeconds.innerHTML = seconds;
    }

    if (seconds > 59) {
        minutes++
        seconds = 0
        if (minutes <9) {
            appendMinutes.innerHTML = "0" + minutes
        } else {
            appendMinutes.innerHTML = minutes
        }
        
    }
}

function correct() {
    document.getElementById(counter).style.color = '#545050'
}

function end() {
    isStart = false
    clearInterval(Interval);
    score = calculateScore()
    document.querySelector('.result').append(score+ ' chr/s')
    counter = 0
    document.querySelector('#next').disabled = false
}
function next() {
    progress++
    quote = text[progress].text
    Coded = toKeys(quote)
    document.getElementById('str-holder').innerHTML = ''
    appendQuote(text[progress])
    isFirst = true
    counter = 0
    seconds = 0
    tens = 0
    document.querySelector('#next').disabled = true
    document.querySelector('.result').innerHTML = ''
    document.querySelector('#seconds').innerHTML = '00'
    document.querySelector('#tens').innerHTML = '00'
}
function fail() {
    seconds++
    appendSeconds.innerHTML = seconds;
    var bloody = document.querySelector('.bloody')
    bloody.classList.add('animated')
    bloody.addEventListener( "animationend",  function() {
        bloody.classList.remove("animated");
    });
}

function calculateScore() {
    console.log(counter)
    var score = counter / (Math.round(tens/100) + seconds)
    return score.toFixed(2)
}

document.addEventListener('keydown', (e)=>{
    let keyCode = e.keyCode
    console.log(keyCode)
    if (keyCode == 13) {
        if (isFirst) {
            console.log('starting')
            isStart = true
            isFirst = false
            clearInterval(Interval);
            Interval = setInterval(stoper, 10);
        } else {
            window.location.reload()
        }
    } else {
        checkKey(keyCode)
    }
})
document.addEventListener('click', (e)=>{
    let id = e.target.id
    console.log(id)
    if (id == '0') {
        progress = 0
    } else if (+id) {
        progress = +id
    } else {
        return 0
    }
    console.log('appending')
    if (type == 'short') {
        console.log('short')
        quote = text[progress].text
        Coded = toKeys(quote)
        document.getElementById('str-holder').innerHTML = ''
        appendQuote(text[progress])
    } else {
        text = JSON.parse(readFileSync(dirn+`/typing/texts/${type}/${progress}.json`, 'utf-8'))
        quote = text.text
        Coded = toKeys(quote)
        document.getElementById('str-holder').innerHTML = ''
        appendQuote(text)
    }    
    isFirst = true
    counter = 0
    seconds = 0
    tens = 0
    document.querySelector('#next').disabled = true
    document.querySelector('.result').innerHTML = ''
    document.querySelector('#seconds').innerHTML = '00'
    document.querySelector('#tens').innerHTML = '00'
})
loadCards()
if (type == 'short') {
    appendQuote(text[progress])
} else {
    appendQuote(text)
}
