const chatFrom = document.getElementById("chat-form")
const chatMessages = document.querySelector(".chat-messages");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userName = urlParams.get('username');
const room = urlParams.get('room');

const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const socket = io();

// Join chat room
socket.emit("joinRoom", {userName, room})

// Get room and users
socket.on("roomUsers", ({room, users}) => {
    console.log(room)

    outputRoomName(room);
    outputUsers(users);

})


// 
socket.on("message", message => {
    console.log(message)
    outputMessage(message)

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;

    
})

// Message submit
chatFrom.addEventListener("submit", (e) => {
    e.preventDefault();

    // et message text
    const msg = e.target.elements.msg.value;

    // Emit message to server
    socket.emit("chatMessage", msg);

    //clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

// output message to DOM
function outputMessage(message) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.userName} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;

    chatMessages.appendChild(div)
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.userName}</li>`).join("")}
    `

}