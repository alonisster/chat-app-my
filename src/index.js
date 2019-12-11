const express = require('express');
const http= require('http');
const port = process.env.PORT ||3000;
const app = express();
const socketio = require('socket.io');
const path = require('path')
const Filter = require('bad-words')
const {createMessage, createLocationMessage} = require('./utils/messages')
const {addUser, removeUser, getUser ,getUsersInRoom} = require('./utils/users')
const publicDirPath = path.join(__dirname, '../public');
app.use(express.static(publicDirPath));

const server = http.createServer(app);
const io = socketio(server);

io.on('connection',(socket)=>{
    // console.log('connected!')
    //socket.emit('message',createMessage('Welcome',new Date().getTime()));
    // socket.broadcast.emit('message', createMessage('a new user joined the chat',new Date().getTime()))

    socket.on('sendMessage',(msg, callback)=>{
        const filter = new Filter();
        const id = socket.id;
        const user = getUser(id);
        if(!user){
            return callback('cannot find sender. error occured')
        }
        if(filter.isProfane(msg)){
            return callback('The msg contains profane words. please be polite.')
        }
        
        //const timeStamp = new Date().getTime();
        io.to(user.room).emit('message',createMessage(msg,user.username));
        callback();
    })

    socket.on('disconnect',()=>{
        const id = socket.id;
        const removedUser = removeUser(id);
        if(!removedUser){
            return console.log('unable to find user to remove')
        }
        io.to(removedUser.room).emit('message', createMessage(`${removedUser.username} have left`,removedUser.username))
        io.to(removedUser.room).emit('roomData',{
            room: removedUser.room,
            users: getUsersInRoom(removedUser.room)
        })
    })
    
    socket.on('sendLocation',(coords, callback)=>{
        const id = socket.id;
        const user = getUser(id);
        if(!user){
            return callback('cannot find sender. error occured')
        }
        io.to(user.room).emit('locationMessage',createLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longtitude}`,user.username))
        callback()
    })

    socket.on('join',({username, room},callback)=>{
        response = addUser(socket.id, username,room)
        if(response.error){
            //console.log('err')
            return callback(response.error);
        };
        console.log('user added '+response.user.username +' in room '+response.user.room)
        //else the user already added.

        socket.join(response.user.room);
        socket.broadcast.to(response.user.room).emit('message',createMessage('a new user joined '+username,'Admin   '))
        socket.emit('message', createMessage('Welcome '+username+" !",'Admin'))

        io.to(response.user.room).emit('roomData',{
            room: response.user.room,
            users: getUsersInRoom(response.user.room)
        })

        callback();
    })

    
    // socket.on('increment',()=>{
    //     count++;
    //     io.emit('valueUpdated',count)
    // })
})




// io.on('valueUpdated', (socket)=>{
//     socket.
// })


server.listen(port,()=>{
    console.log('welcome. listening on '+port)
})
