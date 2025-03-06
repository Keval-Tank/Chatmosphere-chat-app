const socket = io('http://localhost:3000');
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
const listblock = document.getElementById('userList');
const closebtn = document.getElementById('closebtn');
const user_list = document.getElementById('list');
const fileinpt = document.getElementById('fileinp');
const op1 = document.getElementById('opt');
// const roomname = document.getElementById('roomname');
const disrID = document.getElementById('numbers');



const append2 = (name, message, position) => {
    const messageElement = document.createElement('div');
    const p = document.createElement('h6');
    p.innerText = name;
    if (position == 'left') {
        p.classList.add('leftPO');
    }
    if (position == 'right') {
        p.classList.add('rightPO');
    }
    messageContainer.append(p)
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') {
        audio.play();
    }
}

const append1 = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') {
        audio.play();
    }
}

const add_member = (user_list, u_list) => {
    while (user_list.firstChild) {
        user_list.removeChild(user_list.firstChild);
    }
    for (let i in u_list) {
        const row = document.createElement('p');
        row.innerText = u_list[i];
        user_list.append(row);
    }
}

const update_list = (user_list, u_list) => {
    while (user_list.firstChild) {
        user_list.removeChild(user_list.firstChild);
    }
    for (let i in u_list) {
        const row = document.createElement('p');
        row.innerText = u_list[i];
        user_list.append(row);
    }
}


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = msginp.value;
    append2("You", `${message}`, 'right');
    socket.emit('send', message);
    pressed.play();
    msginp.value = '';
})
  
const uname = prompt("Enter Your Name");

// socket.on('check-key', data => {
//     const key = data.key;
//     if(roomID == key){
//         uname = data.joinee;
//         socket.emit('approved',e)
//     }else{
//         socket.emit('not-approved',e)
//     }
// })

socket.emit('new-user-joined', uname)

socket.on('update-user-count', length => {
    ucount.innerText = length;
})

socket.on('update-member-list', name => {
    add_member(user_list, name);
})


socket.on('user-joined', uname => {
    append1(`${uname} joined the chat`, 'left');
    joined.play();
})

socket.on('receive', data => {
    append2(`${data.name}`, `${data.message}`, 'left');
})

socket.on('file-recieve', data => {
    let buffer = data.data;
    let details = data.info;
    let f = new File([buffer],data.info.file_name,{type:data.info.type});
    console.log(f);
    let url = URL.createObjectURL(f);
    let el = document.createElement('div');
        el.classList.add('message');
        el.classList.add('left');
        el.innerHTML =`
            <div class="file_container">
                <div class="file_details">
                    <span id='details'>Name: ${details.file_name}</span><br>
                    <span id='details'>Size: ${details.file_size} Bytes</span><br>
                    <span id='details'>Sender: ${details.sender}</span><br>
                    <span id='details'>Type: ${details.type}</span><br>
                </div>
                <div class="opt_icons">
                    <a id='opt' href='${url}' download="${details.file_name}"><i class="fa-solid fa-download fa-lg" style="color: #ffffff;"></i><span id="text">Download</span></a>
                    <!-- <button id='opt' class='delete' onclick={removeDiv}><i class="fa-solid fa-trash fa-lg" style="color: #ffffff;"></i></button> -->
                </div>
            </div>
            `;
        messageContainer.append(el);
    buffer = {}
    details = {}
})

function removeDiv(el){
    el.style.display = 'none';
}

socket.on('leave', name => {
    append1(`${name} left the chat`, 'left');
    left.play();

})

socket.on('remove-member', u_list => {
    update_list(user_list, u_list);
})

user_count.addEventListener("click", () => {
    listblock.style.display = "block";
})

closebtn.addEventListener('click', () => {
    listblock.style.display = 'none';
})

fileinpt.addEventListener('change', function (e) {
    let file = e.target.files[0];
    let f_name = e.target.files[0].name;
    let fsize = e.target.files[0].size;
    let type = e.target.files[0].type;
    if (!file) {
        return;
    }
    let reader = new FileReader();
    reader.onload = function (e) {
        let buffer = new Uint8Array(reader.result);
        console.log(buffer);
        let el = document.createElement('div');
        el.classList.add('message');
        el.classList.add('right');
        el.innerHTML =`
            <div class="file_container">
                <div class="file_details">
                    <span id='details'>Name: ${f_name}</span><br>
                    <span id='details'>Size: ${fsize} Bytes</span><br>
                    <span id='details'>Sender: ${uname}</span><br>
                    <span id='details'>Type: ${type}</span><br>
                </div>
                <div class="opt_icons">
                    <button id='opt'><i class="fa-solid fa-download fa-lg" style="color: #ffffff;"></i><span id="text">Download</span></button>
                    <!-- <button id='opt' class='delete' onclick={removeDiv}><i class="fa-solid fa-trash fa-lg" style="color: #ffffff;"></i></button> -->
                </div>
            </div>`;
        messageContainer.append(el);
        let details = {
            file_name : f_name,
            file_size : fsize,
            sender : uname,
            type : type
        };
        let parcel = {
            data : buffer,
            info : details
        };
        socket.emit('send-file',parcel);
    }
    reader.readAsArrayBuffer(file);
})
