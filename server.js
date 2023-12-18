const express=require('express')
const cors = require('cors')
const app=express()

app.use(cors())

const http=require('http').createServer(app)

const PORT=process.env.PORT || 7000

http.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
})

app.use(express.static(__dirname+ '/public'))

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html')
})

//socket

const io=require('socket.io')(http)

io.on('connection', (socket)=>{
    console.log('connected...');
    
    socket.on('join', (names) => {
    socket.username=names;
    socket.broadcast.emit('join', names)
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('leave', socket.username); // Use the stored name
    });

    socket.on('message',(msg)=>{
    socket.broadcast.emit('message', msg)
    });
})
