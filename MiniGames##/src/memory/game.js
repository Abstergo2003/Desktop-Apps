var holder = document.querySelector('.game')
let result = [];
var pary = []
var counter = 0
var round = 1
var seconds = 0; 
var tens = 0; 
var score = 0
var appendTens = document.getElementById("miliseconds")
var appendSeconds = document.getElementById("seconds")
var Interval ;
var highscores
let isGameRunning = true
let points = 0
var button = document.getElementById('button')
var succes = document.getElementById('succes')
succes.volume = 1
const {readFileSync, writeFileSync} = window.fs
window.electron.ipcRenderer.send('askPath');
window.electron.ipcRenderer.on('userData',function (event, userData) {
  path = userData
  highscores = JSON.parse(readFileSync(userData+'\\highscores.json', 'utf-8'))
  document.getElementById('highscore').innerText = `Highscore: ${highscores.memory}`
  var options = JSON.parse(readFileSync(userData+'\\options.json', 'utf-8'))
  var background = document.getElementById('background')
  background.volume = options.volume/100
  background.play()
  button.volume = options.volume/100
})
function shuffleCards() {
  let values = Array.from({length: 22}, (_, i) => i + 1);

// Add one extra value that will only appear once
  values.push(0);

// Shuffle the array randomly
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
} 

// Duplicate each value except for the one that appears once
  for (let i = 0; i < values.length; i++) {
    let value = values[i];
    if (value === 0) {
      result.push(value);
    } else {
      result.push(value, value);
    }
  }
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
// Pad the array with zeroes to a length of 45
  console.log(result)
  loadCars(result)
}
function loadCars(array) {
  var game = document.querySelector('.game')
    for (var k = 0; k<array.length; k++) {
        game.innerHTML += `<div id="${k}" class="card"></div>`
    }
}
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
function updateRound(cround) {
  document.getElementById('round').innerText = `Round: ${cround}`
}
function updateCards() {
  var cards = document.querySelectorAll('.card')
  for (var i = 0; i<cards.length; i++) {
    cards[i].style.color = '#62BBC1'
  }
  counter = 0
  updateRound(round++)
  if (pary[1].value == pary[0].value) {
    updateScore()
    succes.play()
    console.log('para')
    document.getElementById(pary[0].id).remove()
    document.getElementById(pary[1].id).remove()
  }
  pary = []
}
function startTimer () {
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
  if (isGameRunning == false) {
    clearInterval(Interval)
  }
}
function updateScore() {
  points = points + 89
  score = Math.round(points/seconds)
  if (points == 1958) {
    isGameRunning == false
  }
  document.getElementById('score').innerText  = `Score: ${score}`
}
function back() {
  if (score > highscores.memory) {
    highscores.memory = score
    writeFileSync(path + '\\highscores.json', JSON.stringify(highscores))
  }
  window.location.href = '../index.html'
}
window.onload = function() {
  clearInterval(Interval);
  Interval = setInterval(startTimer, 10);
}
document.getElementById('reset').addEventListener('click', ()=>{
  window.location.reload()
})
document.getElementById('back').addEventListener('click', back)
document.addEventListener('click', (e)=>{
  button.play()
  let id = e.target.id
  console.log(id)
  if (id == '0' || +id) {
    var card = document.getElementById(id)
    card.classList.add('animated')
    card.addEventListener( "animationend",  function() {
      card.classList.remove("animated");
    } );
    card.innerHTML = result[id]
    card.style.color = '#010400'
    counter++
    obj = {
      'id' : id,
      "value" : result[id]
    }
    pary.push(obj)
    if (counter == 2) {
      delay(5000).then(()=>{
        updateCards()
      })
    } if (counter == 3) {
      updateCards()
    }
  }
})
shuffleCards()