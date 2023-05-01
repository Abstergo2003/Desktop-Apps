const { contextBridge, ipcRenderer} = require('electron');
const fs = require('fs');
const path  = require('path')
const {spawn} = require('child_process')
const optionsPath = path.join(__dirname, 'options.json')
const savesPath = path.join(__dirname,'saves')
const keyCodesPath = path.join(__dirname, 'keyCodes.json')
const charactersPath = path.join(__dirname, 'characters.json')
contextBridge.exposeInMainWorld("electron", {
    ipcRenderer: {
      ...ipcRenderer,
      on: ipcRenderer.on.bind(ipcRenderer),
      removeListener: ipcRenderer.removeListener.bind(ipcRenderer),
    },
  });
contextBridge.exposeInMainWorld('fs', {
    readFileSync: fs.readFileSync,
    writeFileSync: fs.writeFileSync,
    createWriteStream: fs.createWriteStream,
    mkdir: fs.mkdir,
    rmSync: fs.rmSync,
    writeFile: fs.writeFile
    // Add other methods and properties of the fs module that you need.
});
contextBridge.exposeInMainWorld('path', {
    options: optionsPath,
    saves: savesPath,
    keyCodes: keyCodesPath,
    characters : charactersPath,
    join : path.join,
    dirname : __dirname
    // Add other methods and properties of the path module that you need.
});
const peerjsProcess = spawn('peerjs', ['--port', '3001'], {shell: true});
const express = require('express')
const game = express()
const server  = require('http').Server(game)
const io = require('socket.io')(server)
const {v4 : uuidV4} = require('uuid');
const { electron } = require('process');

game.set('views', path.join(__dirname, 'views'));
game.set('view engine', 'ejs')
game.use(express.static(path.join(__dirname, 'public')))

game.get('/', (req, res)=>{
    res.redirect(`/${uuidV4()}`)
})
game.get('/:game', (req, res)=>{
    res.render('game', {roomId: req.params.room})
})

io.on('connection', socket =>{
    socket.on('join-room', (roomId, userId)=>{
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId)
//add listeners to event here
        socket.on('disconnect', ()=>{
            socket.to(roomId).emit('user-disconnected', userId) //disconnected user, dont delete
        })
        //custom events
        socket.on('message', text =>{
            console.log(text)
            socket.to(roomId).emit('message', text)
        })
        socket.on('dataFetch', vari=>{
            socket.to(roomId).emit('dataFetch', vari)
        })
        socket.on('attack', mobs=>{
            socket.to(roomId).emit('attack', mobs)
        })
        socket.on('move', avatar=>{
            socket.to(roomId).emit('move', avatar)
        })
        socket.on('new-enemy', obj=>{
            socket.to(roomId).emit('new-enemy', obj)
        })
        socket.on('new-player', obj=>{
            socket.to(roomId).emit('new-player', obj)
        })
        socket.on('new-message', obj=>{
            socket.to(roomId).emit('new-message', obj)
        })
        socket.on('heal', mobs=>{
            socket.to(roomId).emit('heal', mobs)
        })
        socket.on('new-map', src=>{
            socket.to(roomId).emit('new-map', src)
        })
        socket.on('new-net', obj=>{
            socket.to(roomId).emit('new-net', obj)
        })
        socket.on('new-margins', obj=>{
            socket.to(roomId).emit('new-margins', obj)
        })
    })
})
server.listen(3000)