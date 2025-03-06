
// const port = process.env.PORT
const io = require('socket.io')(3000, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const fs = require('fs');
const path = require('path');
const user = {}
const UPLOADS_DIR = path.join(__dirname, 'uploads');

io.on('connection', socket => {


    socket.on('new-user-joined', name => {
        console.log("New user", name);
        user[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
        io.emit('update-user-count', Object.keys(user).length);
        io.emit('update-member-list', user);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: user[socket.id] })
    });

    socket.on('send-file', data => {
        socket.broadcast.emit('file-recieve', data)
    });

   
    socket.on('disconnect', message => {
        socket.broadcast.emit('leave', user[socket.id]);
        delete user[socket.id];
        io.emit('update-user-count', Object.keys(user).length);
        io.emit('remove-member',user);
        
    });

    
})