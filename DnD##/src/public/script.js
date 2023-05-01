const socket = io('/')
const peers = {}
const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001'
})

socket.on('user-connected', userId =>{
    connectToNewUser(userId)
    console.log('User connected: ' + userId)
    socket.emit('dataFetch', variables)
})
socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
})
myPeer.on('open', id =>{
    socket.emit('join-room', ROOM_ID, id)
})
//fetching data on join
socket.on('dataFetch', vari=>{
    variables = vari
    GameLog = variables.logs
    loadChat()
if (variables.temp.path != undefined) {
    console.log('path defined')
    mapLoaderImg()
}
if (variables.temp.step != undefined) {
    console.log('step defined')
    document.documentElement.style.setProperty('--step', variables.temp.step + "px")
    mapLoaderNet()
}
})
// new user connecting
function connectToNewUser(userId) {
    const call = myPeer.call(userId)
    peers[userId] = call
}
