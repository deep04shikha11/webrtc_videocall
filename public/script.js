const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001'
})


const myVideo = document.createElement('video')
myVideo.muted = true
const peers= {}
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })
})

socket.on('user-disconnected', userId => {
    // console.log(userId)
    if(peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})


function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })

    peers[userId]= call
}


function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}

var endcalling=document.getElementById("endingcall");
endcalling.onclick=function(){
    alert("End call");
    endcalls(userId);
}

var togglecam=document.getElementById("togglecamera");
togglecam.onclick=function(){
    alert("toggle camera");
}

var toggle_voice=document.getElementById("togglevoice");
toggle_voice.onclick=function(){
    alert("toggle voice");
}

var toggle_chats=document.getElementById("togglechats");
toggle_chats.onclick=function(){
    alert("toggle chats");
}

var toggle_setting=document.getElementById("togglesetting");
toggle_setting.onclick=function(){
    alert("toggle setting");
}