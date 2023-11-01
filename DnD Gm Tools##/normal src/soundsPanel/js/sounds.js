function playMain() {
    var audio = document.getElementById('main')
    audio.volume = document.getElementById('mainVolume').value / 100
    if (audio.paused) {
        audio.play()
        document.getElementById('playMain').classList.add('clicked')
    } else {
        audio.pause()
        document.getElementById('playMain').classList.remove('clicked')
    }
}
document.getElementById('playMain').addEventListener('click', playMain)
document.getElementById('mainVolume').addEventListener('change', ()=>{
    var volume = document.getElementById('mainVolume').value
    document.getElementById('innerMainVolume').style.width = volume + '%'
    document.getElementById('main').volume = volume / 100
})
document.getElementById('main').addEventListener('timeupdate', ()=>{
    var currentTime = document.getElementById('main').currentTime
    var duration = document.getElementById('main').duration
    document.getElementById('innerMainCompletion').style.width = currentTime / duration * 100 + '%'
})
document.getElementById('mainCompletion').addEventListener('change', ()=>{
    var completion = document.getElementById('mainCompletion').value
    document.getElementById('main').currentTime = document.getElementById('main').duration * completion / 100
})
document.getElementById('loopMain').addEventListener('click', ()=>{
    var audio = document.getElementById('main')
    if (!audio.loop) {
        audio.loop = true
        document.getElementById('loopMain').classList.add('clicked2')
    } else {
        audio.loop = false
        document.getElementById('loopMain').classList.remove('clicked2')
    }
})

function playSub() {
    var audio = document.getElementById('sub')
    audio.volume = document.getElementById('subVolume').value / 100
    if (audio.paused) {
        audio.play()
        document.getElementById('playSub').classList.add('clicked')
    } else {
        audio.pause()
        document.getElementById('playSub').classList.remove('clicked')
    }
}
document.getElementById('playSub').addEventListener('click', playSub)
document.getElementById('subVolume').addEventListener('change', ()=>{
    var volume = document.getElementById('subVolume').value
    document.getElementById('innerSubVolume').style.width = volume + '%'
    document.getElementById('sub').volume = volume / 100
})
document.getElementById('sub').addEventListener('timeupdate', ()=>{
    var currentTime = document.getElementById('sub').currentTime
    var duration = document.getElementById('sub').duration
    document.getElementById('innerSubCompletion').style.width = currentTime / duration * 100 + '%'
})
document.getElementById('subCompletion').addEventListener('change', ()=>{
    var completion = document.getElementById('subCompletion').value
    document.getElementById('sub').currentTime = document.getElementById('sub').duration * completion / 100
})
document.getElementById('loopSub').addEventListener('click', ()=>{
    var audio = document.getElementById('sub')
    if (!audio.loop) {
        audio.loop = true
        document.getElementById('loopSub').classList.add('clicked2')
    } else {
        audio.loop = false
        document.getElementById('loopSub').classList.remove('clicked2')
    }
})

function addMore() {
    var input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'audio/*')
    input.click()
    input.addEventListener('change', ()=>{
        var source = input.files[0].path
        var dest = join(soundsPath, input.files[0].name)
        copyFile(source, dest, (err) => {
            if (err) throw err;
            console.log(`${source} was copied to ${dest}`);
        })
        input.remove()
        document.location.reload()
    })
}