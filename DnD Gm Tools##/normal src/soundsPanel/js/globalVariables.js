const {join} = window.path
const {copyFile, readdir, readFileSync} = window.fs
const savesPath = localStorage.getItem('savesPath')
const currentSave = localStorage.getItem('currentSave')
const soundsPath = join(savesPath, currentSave, 'sounds',)

function loadCustomSounds() {
    readdir(soundsPath, (err, files)=>{
        console.log(files)
        var holder = document.querySelector('.availible')
        for (var i = 0; i< files.length; i++) {
            holder.innerHTML += `<span path="${soundsPath}\\${files[i]}">${files[i]}</span>`
        }
    })
}
loadCustomSounds()