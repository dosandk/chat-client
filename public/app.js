const socket = io.connect('https://front-camp-chat.herokuapp.com/chat');
const form = document.getElementById('form');
const [messageBox] = form.getElementsByTagName('textarea');
const chatElement = document.getElementById('chat');

form.addEventListener('submit', e => {
    e.preventDefault();
    socket.emit('chat message', messageBox.value);
    messageBox.value = '';
});

socket.on('connect', () => {
    console.log(socket.id); // 'G5p5...'
});

socket.on('chat message', msg => {
    const message = document.createTextNode(msg);
    const liElement = document.createElement('li');

    liElement.appendChild(message);
    chatElement.appendChild(liElement);
});
