const {join} = window.path
const __dirname = window.path.dirname
const {writeFile} = window.fs
const {spawn} = window.child
let userDataPath
document.getElementById('new-game').addEventListener('click', ()=>{
    window.location.href = 'new_game/index.html'
})
document.getElementById('load-game').addEventListener('click', ()=>{
    window.location.href = 'load_game/index.html'
})
document.getElementById('options').addEventListener('click', ()=>{
    window.location.href = 'options/index.html'
})
document.getElementById('my-characters').addEventListener('click', ()=>{
    window.location.href = 'characters/index.html'
})
document.getElementById('footnotes').addEventListener('click', ()=>{
    window.location.href = 'footnotes/index.html'
})
document.getElementById('join-game').addEventListener('click', ()=>{
    console.log('joining game')
    document.getElementById('joinForm').style.left = '-500%'
    var path = document.getElementById('join-path').value
    console.log(path)
    window.ipcRenderer.send('play-game', 'ok');
    window.ipcRenderer.send('create-join-window', path);
})
if (localStorage.getItem('isFirst') == 'false') {
    console.log('first run')
    localStorage.setItem('isFirst', true)
    const peerjsProcess = spawn('npm i peerjs', ['-g'], {shell: true});
}
document.addEventListener('click', ()=>{
    window.electron.ipcRenderer.send('button', 'ok');
})
window.electron.ipcRenderer.send('askPath');
window.electron.ipcRenderer.on('userData',function (event, userData) {
    userDataPath = userData
    console.log(userDataPath)
    if (!localStorage.getItem('isFirst')) {
        console.log('first run')
        const peerjsProcess = spawn('npm i peerjs', ['-g'], {shell: true});
        console.log(userDataPath + '/options.json')
        writeFile(userDataPath + '/options.json', '{"volume":50,"language":"en","addEnemy":80,"attack":79,"move":77,"dice":89,"setMap":73,"addPlayer":85}', function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });
        writeFile(userDataPath + '/saveTable.json', '[{"const":{"name":"test","topic":"test","villain":"test","localization":"test","description":"test","pathToIcon":""},"temp":{"mobs":[],"players":[],"path":"","step":40,"marginL":0,"marginT":0},"logs":[],"id":-1}]', function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });
        writeFile(userDataPath + '/saveToLoad.json', '{}', function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });
        writeFile(userDataPath + '/characters.json', '[{"const":{"name":"test","class":"bard","level":"20","background":"","race":"","alignment":""},"attributes":{"main":{"base":{"strength":"","dexterity":"","constitution":"","intelligence":"","wisdom":"","charisma":""},"added":{"strength":"5","dexterity":"","constitution":"","intelligence":"","wisdom":"","charisma":""}},"stuff":{"ac":"","initiative":"","speed":"","maxHP":"","currentHP":"","deathSaves":{"succeses":0,"failures":0}},"savingThrows":{"strength":"","dexterity":"","constitution":"","intelligence":"","wisdom":"","charisma":""},"skills":{"acrobatics":"","animal":"","arcana":"","athletics":"","deception":"","history":"","insight":"","intimidation":"","investigation":"","medicine":"","nature":"","perception":"","performance":"","persuasion":"","religion":"","sleightOfHand":"","stealth":"","survival":""},"passiveWisdom":"","proficiencyBonus":""},"equipment":{"weapons":[],"treasures":{"money":{"cp":"","sp":"","ep":"","gp":"","pp":""},"other":""},"backpack":""},"features":"","characterDescription":{"appearance":"","background":""},"id":"0"}]', function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });
        writeFile(userDataPath + '/charactersToLoad.json', '{}', function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });
        localStorage.setItem('isFirst', true)
    }
})