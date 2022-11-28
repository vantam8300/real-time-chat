const express = require("express");
const app = express();
const path = require("path");
const http = require('http').Server(app);
const io = require("socket.io")(http)

const PORT = process.env.PORT || 3001;

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
})

users = [];
io.on('connection', function (socket) {
    console.log('A user connected');
    socket.on('setUsername', function (data) {
        console.log(data);
        if (users.indexOf(data) > -1) {
            socket.emit('userExists', data + ' username is taken! Try some other username.');
        } else {
            users.push(data);
            socket.emit('userSet', { username: data });
        }
    });
    socket.on('msg', function (data) {
        //Send message to everyone
        io.sockets.emit('newmsg', data);
    })
    socket.on("disconnect", function (data) {
        console.log('A user disconnected');
    })
});
http.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
})