// Node Server which will handle socket.io connections
const io = require("socket.io")(8000)
const users = {}


io.on('connection', socket => {
    // If any new user joined, let other users know
    socket.on('new-user-joined', name => {
        users[socket.id] = name

        // console.log("new user", name)
        socket.broadcast.emit('user-joined', name)
    })

    // If someone sends a message, broadcast it to other users
    socket.on('send', message => {
        socket.broadcast.emit('receive', {
            message: message,
            name: users[socket.id]
        })
    })

    // If someone leaves the chat, let other users know
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id])
        delete users[socket.id]
    })
})

console.log("Server started successfully")