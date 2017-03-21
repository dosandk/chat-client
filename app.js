function View({ el, template, events = {} }) {
  this.el = document.querySelector(el);
  this.template = document.getElementById(template);
  this.events = events;
}

View.prototype.render = function(callback) {
  this.el.innerHTML = this.template.innerHTML;

  if (typeof callback === 'function') {
    callback.bind(this)();
  }

  Object.keys(this.events).forEach(item => {
    const [eventType, el] = item.split(' ');
    const elDom = this.el.querySelector(el) || document.querySelector(el);

    elDom.addEventListener(eventType, this.events[item].bind(this));
  });

  return this;
};

View.prototype.show = function () {
  this.el.style.display = 'block';
  return this;
};

View.prototype.hide = function () {
  this.el.style.display = 'none';
  return this;
};

const DOMAIN_URL = 'http://localhost:8080/';
const API_URL = 'http://front-camp-chat.herokuapp.com/';

const App = {
  loginFormView: new View({
    el: '#login-form-view',
    template: 'login-form-tpl',
    events: {
      'submit #login-form': initLogin
    }
  }),
  logoutFormView: new View({
    el: '#logout-form-view',
    template: 'logout-tpl',
    events: {
      'click #logout': initLogout
    }
  }),
  chatView: new View({
    el: '#chat-view',
    template: 'chat-tpl',
    events: {
      'submit #form': initMessageSending
    }
  }),
  user: {}
};

App.loginFormView.render();

function initLogin(e) {
  const loginUrl = `${API_URL}login`;
  const usernameEl = document.getElementById('username');
  const passEl = document.getElementById('pass');
  const username = usernameEl.value;
  const pass = passEl.value;

  e.preventDefault();

  post(loginUrl, {username, pass})
  .then(response => {
    response.json()
    .then(user => App.user = JSON.stringify(user))
    .catch(errorHandler);

    e.target.reset();

    App.loginFormView.hide();
    App.chatView.render(initSocket);
    App.logoutFormView.render();
  })
  .catch(errorHandler);
}

function initLogout() {
  post(`${API_URL}logout`, {})
  .then(() => {
    App.loginFormView.show();
    App.logoutFormView.hide();
    App.chatView.hide();

    log('logout!');
  })
  .catch(errorHandler);
}

function initMessageSending(e) {
  const [messageBox] = e.target.getElementsByTagName('textarea');

  e.preventDefault();

  this.socket.emit('message', messageBox.value);
  e.target.reset();
}

function initSocket() {
  const chatElement = document.getElementById('chat');

  this.socket = io.connect(`${API_URL}`);

  this.socket.on('message', msg => {
    printMessage(msg);
  });

  this.socket.on('join', () => {
    printMessage(`${App.user} joined to chat`);
  });

  this.socket.on('leave', () => {
    printMessage(`${App.user} left chat`);
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
