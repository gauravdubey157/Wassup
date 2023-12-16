const socket = io();


let names;
const textarea=document.querySelector('#textarea')
const messageArea=document.querySelector('.message__area')
const button=document.querySelector('#sendbtn')

do{
    names=prompt('Please enter your name: ')
}while(!names)

socket.emit('join', names);

textarea.addEventListener('keyup', (e)=>{
    if(e.key==='Enter')
    {
        sendMessage(e.target.value) 
    }
})

button.addEventListener('click', ()=>{
    sendMessage(textarea.value);
})

function sendMessage(message)
{
    let msg={
        user:names,
        message:message.trim()
    }

    //append
    appendMessage(msg, 'outgoing')
    textarea.value=''
    scrollToBottom()

    //send to server
    socket.emit('message', msg)    //message here is event and msg is data which we are emiting
}



function appendMessage(msg, type)
{
    let mainDiv=document.createElement('div')
    let className=type;

    mainDiv.classList.add(className, 'message')

    let markup;
    if (type === 'center') 
    { // For join and leave messages
        markup = `<p>${msg.message}</p>`;
    } 
    else 
    { // For regular messages
        markup = `
            <h4>${msg.user}</h4>
            <p>${msg.message}</p>
        `;
    }
    mainDiv.innerHTML=markup;
    messageArea.appendChild(mainDiv)
    scrollToBottom();
}

socket.on('join',(name)=>{
    appendMessage({ message: `${name} joined` },'center');
});

// Recieve messages
socket.on('message',(msg)=>{
    appendMessage(msg,'incoming');
    scrollToBottom();
})

socket.on('leave', (name) => {
    if (name) {
        appendMessage({ message: `${name} left` }, 'center');
    }
});



function scrollToBottom(){
    messageArea.scrollTop=messageArea.scrollHeight
}
