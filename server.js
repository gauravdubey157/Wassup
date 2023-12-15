const express=require('express')
const app=express()

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
    
    socket.on('join', (name) => {
    socket.broadcast.emit('join', name)
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('leave', socket.username);
    });

    socket.on('message',(msg)=>{
    socket.broadcast.emit('message', msg)
    });
})