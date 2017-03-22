function loginFormView() {
  const modules = [
    './js/config',
    './js/default-view'
  ];

  return Promise.all(modules.map(item => require(item))).then(data => {
    const [config, View] = data;

    return new View({
      el: '#chat-view',
      template: 'chat-tpl',
      events: {
        'submit #form': initMessageSending
      },
      afterRender: initSocket
    });

    function initMessageSending(e) {
      const [messageBox] = e.target.getElementsByTagName('textarea');

      e.preventDefault();

      this.socket.emit('message', messageBox.value);
      e.target.reset();
    }

    function initSocket() {
      const chatElement = document.getElementById('chat');

      this.socket = io.connect(`${config.API_URL}`);

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

  });
}
