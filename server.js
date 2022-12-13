const express = require("express");
const app = express();
const http = require('http').Server(app);
const io = require("socket.io")(http)
const formatMessage = require("./public/assets/js/messages")
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require("./public/assets/js/users")

const PORT = process.env.PORT || 3001;

app.use(express.static("public"));

const botName = "ChatApp Bot"
// Run when client connect
io.on('connection', socket => {
    //
    socket.on("joinRoom", ({ userName, room }) => {
        const user = userJoin(socket.id, userName, room);

        socket.join(room)

        // Wellcome current user
        socket.emit("message", formatMessage(botName, "Wellcome to ChatApp"));

        // Broadcast when a user connect
        socket.broadcast.to(user.room).emit("message", formatMessage(botName, `${user.userName} has joined the chat`));

        // send users and room info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    });
 
    // Listen for chatMessage
    socket.on("chatMessage", (msg) => {
        const user = getCurrentUser(socket.id);
        
        io.to(user.room).emit("message", formatMessage(user.userName, msg))
    })

    // Run when client disconnects
    socket.on("disconnect", () => {
        const user = userLeave(socket.id);
        
        if (user) {
            io.to(user.room).emit("message", formatMessage(botName, `${user.userName} has left the chat`));

        }

         // send users and room info
         io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })
})


http.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
})