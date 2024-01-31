const socket = io();

let names, room;
const textarea = document.querySelector('#textarea');
const messageArea = document.querySelector('.message__area');
const button = document.querySelector('#sendbtn');
const backbtn=document.querySelector('#backbtn')

let audio=new Audio('tune.mp3')
audio.preload='auto'
audio.load();

backbtn.addEventListener('click',()=>{
    // window.history.back()
    window.location.href='/'
})

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    names = urlParams.get('names');
    room = urlParams.get('room');
    const action = urlParams.get('action');

    if (action === 'joinRoom' && room) {
        joinRoom(room);
    } else if (action === 'talk') {
        randomChat();
    }

    listenForMessages();
};

function joinRoom(room) {
    socket.emit('joinRoom', { names, room });
}

function randomChat() {
    room = 'RandomRoom';
    socket.emit('joinRoom', { names, room });
}

function listenForMessages() {
    socket.on('message', (msg) => {
        const type = msg.type === 'center' ? 'center' : (msg.user === names ? 'outgoing' : 'incoming');
        appendMessage(msg, type);
    });
}

textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        sendMessage(e.target.value);
    }
});

button.addEventListener('click', () => {
    sendMessage(textarea.value);
});

function sendMessage(message) {
    let msg = {
        user: names,
        message: message.trim(),
        room: room
    };

    if (msg.message) {
        // appendMessage(msg, 'outgoing');
        textarea.value = '';
        scrollToBottom();
        socket.emit('message', msg);
    }
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div');
    mainDiv.classList.add(type, 'message');

    // Get the current time
    let currentTime = new Date();
    let timestamp = currentTime.getHours() + ':' + currentTime.getMinutes().toString().padStart(2, '0');

    let markup = (type === 'center') 
        ? `<p>${msg.message}</p>` 
        : `<h4>${msg.user}</h4><p>${msg.message}</p><span class="timestamp">${timestamp}</span>`;

    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
    scrollToBottom();
    audio.play();
}

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}
