const socket = io("http://localhost:8000", { transports: ['websocket', 'polling', 'flashsocket'] })

// DOM Elements
const form = document.getElementById("send")
const messageInput = document.getElementById("messageInput")
const messageContainer = document.querySelector('.container')

// created, to scroll pages in every new message
function pageScroll() {
    messageContainer.scrollBy(0, messageContainer.scrollHeight);
}

// Function to add elements in message container on special event
const append = ({message, position, name}) => {
    const messageElement = document.createElement('div')
    const messageContent = document.createElement('p')

    //`<div class="message ${position}"> <p><span class="username">${name} :</span><br> ${message} </p> </div>`

    messageContent.innerHTML = `<span class="username">${name}</span> ${message}`
    messageElement.classList.add("message")
    messageElement.classList.add(position)

    messageContainer.append(messageElement)
    messageElement.append(messageContent)

    pageScroll()

}


// Asks for name and send the 'name' to the server  
const name = prompt("Enter your name: ")
socket.emit('new-user-joined', name)

// If any new user joins, let the server receive the event
socket.on('user-joined', name => {
    append({
        name: name,
        message:`joined the chat`, 
        position: 'mid',
    })
})

// If server sends a message, 'receive' the data
socket.on('receive', data => {
    append({
        message:`\n ${data.message}`, 
        position: 'left',
        name: `${data.name} :<br>`
    })
})

// If a user leaves, append the info to the container/chat
socket.on('left', name => {
    append({
        name: name,
        message:`left the chat`, 
        position:'mid'
    })
})


// When the form gets submitted, send message to the server
form.addEventListener("submit", (e) => {
    e.preventDefault()
    const message = messageInput.value

    if (message != '') {
        append({
            message:`${message}`,
            position:'right',
            name:'',
        })

        socket.emit('send', message)  // Telling socket.io server that we are 'sending' message
    }

    messageInput.value = ''

})

