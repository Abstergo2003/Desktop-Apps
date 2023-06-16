var round = 0
var target
var objects
var isShuffling = true
let bet = 10
let points = 50
let highscores
var button = document.getElementById('button')
var fail = document.getElementById('fail')
var succes = document.getElementById('succes')
const {readFileSync, writeFileSync} = window.fs
window.electron.ipcRenderer.send('askPath')
window.electron.ipcRenderer.on('userData',function (event, userData) {
  path = userData
  highscores = JSON.parse(readFileSync(userData+'\\highscores.json', 'utf-8'))
  document.getElementById('highscore').innerText = `Highscore: ${highscores.hideNseek}`
  var options = JSON.parse(readFileSync(userData+'\\options.json', 'utf-8'))
  var background = document.getElementById('background')
  background.volume = options.volume/100
  background.play()
  button.volume = options.volume/100
  fail.volume = options.volume/100
  succes.volume = 1
})
function back() {
  if (points > highscores.hideNseek) {
    highscores.hideNseek = points
    writeFileSync(path+ '\\highscores.json', JSON.stringify(highscores))
  }
    window.location.href = '../index.html'
}
function reset() {
  if (points > highscores.hideNseek) {
    highscores.hideNseek = points
    writeFileSync(path+ '\\highscores.json', JSON.stringify(highscores))
  }
  window.location.reload()
}
function startRound() {
  round++
  var game = document.querySelector('.game')
  objects = round + Math.ceil(round/3)
  if (objects>20) objects = 20
  for (var i = 0; i<objects; i++) {
    var kubek = document.createElement('div')
    if (objects > 10) {
      kubek.classList.add('kubek2')
    } else {
      kubek.classList.add('kubek1')
    }
    var left = i - Math.floor(i/5)*5
    kubek.style.top = `calc(${Math.floor(i/5)*25}vh + 12.5vh)`
    kubek.style.left = `calc(${left*12}vw + 11vw)`
    kubek.setAttribute('id', i)
    game.append(kubek)
  }
  var randomID = Math.floor(Math.random()*objects)
  target = document.getElementById(randomID)
  target.style.animation = 'target 2s linear'
  target.style.zIndex = 999
  target.setAttribute('tag', 'selected')
  target.addEventListener('animationend', ()=>{
    console.log('shuffling')
    shuffle(target, objects, round)
    if (objects > 10) {
      shuffle(document.getElementById(Math.floor(Math.random()*objects)), objects, round)
    }
  })
}
async function shuffle(target, objects, round) {
  for (let j = 0; j < round; j++) {
    let randomID = Math.floor(Math.random() * objects);
  
    while (randomID == target.id) {
      randomID = Math.floor(Math.random() * objects);
    }
  
    let randomObj = document.getElementById(randomID);
    let binT = randomObj.style.top;
    let binL = randomObj.style.left;
  
    await swapElements(target, randomObj, binT, binL);
  }
  isShuffling = false
}  
async function swapElements(elem1, elem2, binT, binL) {
  await moveElement(elem2, elem1.style.top, elem1.style.left);
  await moveElement(elem1, binT, binL);
}
function moveElement(elem, top, left) {
  return new Promise(resolve => {
    elem.style.top = top;
    elem.style.left = left;
    elem.addEventListener("transitionend", () => {
      resolve();
    }, { once: true });
  });
}
function calculatePoints(result) {
  if (result == 'HIT') {
    succes.play()
    document.getElementById('result-text').innerText = result
    document.getElementById('result-points').innerText = '+' + bet
    points = points + bet
    document.getElementById('score').innerText = `Points: ${points}`
  } else {
    points = points - bet
    if (points <= 0) {
      fail.play()
      document.querySelector('.lost').style.left = '500px'
      document.getElementById('score').innerText = `Points: 0`
      console.log('you lost')
      document.querySelector('.result').style.left = '500px'
      return 0
    }
    document.getElementById('result-text').innerText = result
    document.getElementById('result-points').innerText = '-' + bet
    document.getElementById('score').innerText = `Points: ${points}`
  }
  document.querySelector('.result').style.left = '500px'
}
function poseBet() {
  document.querySelector('.result').style.left = '-1000px'
  bet = document.getElementById('bet').valueAsNumber
  if (bet > points) {
    var betInput = document.getElementById('betinput')
    betInput.style.animation = 'insufficientPoints 1.5s linear'
    betInput.addEventListener('animationend', ()=>{
      betInput.style.animation = 'none'
    })
    return 0
  }
  document.getElementById('score').innerText = `Points: ${points}`
  startRound()
}
document.getElementById('back').addEventListener('click', back)
document.getElementById('reset').addEventListener('click', reset)
document.getElementById('start').addEventListener('click', poseBet)
document.getElementById('next-round').addEventListener('click', poseBet)
document.getElementById('reset2').addEventListener('click', reset)
document.addEventListener('click', (e)=>{
  button.play()
  let id  = e.target.id
  if (+id || id=='0') {
  } else {
    console.log('not a kubek')
    return 0
  }
  if (isShuffling == true) {
    console.log('still shuffling')
    return 0 
  }
  if (document.getElementById(id).getAttribute('tag')=='selected') {
    document.querySelector('.game').innerHTML = ''
    console.log('hit')
    calculatePoints('HIT')
  } else {
    document.querySelector('.game').innerHTML = ''
    console.log('miss')
    console.log('miss')
    calculatePoints('MISS')
  }
})