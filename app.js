function View(elementId, templateId) {
    this.el = document.getElementById(elementId);
    this.template = document.getElementById(templateId);
}

View.prototype.render = function(callback) {
    this.el.innerHTML = this.template.innerHTML;
    if (typeof callback === 'function') {
        callback();
    }
    return this;
};

View.prototype.show = function() {
    this.el.style.display = 'block';
    return this;
};

View.prototype.hide = function() {
    this.el.style.display = 'none';
    return this;
};

const loginFormView = new View('login-form-view', 'login-form-tpl');
const logoutFormView = new View('logout-form-view', 'logout-tpl');
const chatView = new View('chat-view', 'chat-tpl');

loginFormView.render(function() {
    const loginUrl = 'http://localhost:3000/login';
    const loginForm = document.getElementById('login-form');
    const usernameEl = document.getElementById('username');
    const passEl = document.getElementById('pass');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = usernameEl.value;
        const pass = passEl.value;

        post(loginUrl, { username, pass })
        .then(response => {
            response.json()
            .then(user => log(JSON.stringify(user)))
            .catch(errorHandler);

            this.reset();

            loginFormView.hide();
            chatView.render(initSocket);
            logoutFormView.render(initLogout);
        })
        .catch(errorHandler);
    });
});

function initLogout() {
    const logoutEl = document.getElementById('logout');

    logoutEl.addEventListener('click', () => {
        post('http://localhost:3000/logout', {})
            .then(() => {
                loginFormView.show();
                logoutFormView.hide();
                chatView.hide();
            })
            .catch(errorHandler);
        log('logout!')
    });
}

function initSocket() {
    const socket = io.connect('http://localhost:3000/');
    const form = document.getElementById('form');
    const [messageBox] = form.getElementsByTagName('textarea');
    const chatElement = document.getElementById('chat');

    form.addEventListener('submit', e => {
        e.preventDefault();

        socket.emit('message', messageBox.value);
        form.reset();
    });

    socket.on('message', msg => {
        printMessage(msg);
    });

    socket.on('join', msg => {
        printMessage(msg);
    });

    socket.on('leave', msg => {
        printMessage(msg);
    });

    function printMessage(msg) {
        const message = document.createTextNode(msg);
        const liElement = document.createElement('li');

        liElement.appendChild(message);
        chatElement.appendChild(liElement);
    }
}

function post(url, data) {
    return fetch(new Request(url, {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(data)
    }));
}

function errorHandler(err) {
    console.error(`Error: ${err.message}`);
}

function log(data) {
    console.log(`log:: ${data}`);
}
