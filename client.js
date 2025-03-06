
const socket = io('https://chat-app-node-1ae6.onrender.com');
const form = document.getElementById('send-container');
const msginp = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
const audio = new Audio('sounds/recmsg.mp3');
const joined = new Audio('sounds/arraived.mp3');
const pressed = new Audio('sounds/button.mp3');
const left = new Audio('sounds/left.mp3');
const ucount = document.getElementById("ucount");
const btn = document.getElementById('btn');
const user_count = document.getElementById('users');

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomNum = getRandomNumber(1, 20);
console.log(randomNum);
const append2 = (name, message, position) => {
    const messageElement = document.createElement('div');
    const p = document.createElement('h6');
    p.innerText = name;
    if(position == 'left'){
        p.classList.add('leftPO');
    }
    if(position == 'right'){
       p.classList.add('rightPO');
    }
    messageContainer.append(p)
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
}

const append1 = (message,position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
}



form.addEventListener('submit' ,(e)=> {
    e.preventDefault();
    const message = msginp.value;
    append2("You",`${message}`,'right');
    socket.emit('send',message);
    pressed.play();
    msginp.value = '';
})


const uname = prompt("Enter name to join");
socket.emit('new-user-joined',uname)

socket.on('update-user-count' , length => {
    ucount.innerText = length;
})


socket.on('user-joined', uname => {
    append1(`${uname} joined the chat`,'left');
    joined.play();
})

socket.on('receive', data => {
    append2(`${data.name}`,`${data.message}`,'left');
})

socket.on('leave', name => {
    append1(`${name} left the chat`,'left');
    left.play();
})