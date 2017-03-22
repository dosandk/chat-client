const modules = [
  './js/login-form-view',
  './js/chat-view',
  './js/logout-form-view',
];

Promise.all(modules.map(item => require(item))).then(data => {
  const [loginFormView, chatView, logoutFormView] = data;

  const App = {
    loginFormView,
    logoutFormView,
    chatView,
    user: {}
  };

  App.loginFormView.parent = App;
  App.logoutFormView.parent = App;
  App.chatView.parent = App;

  App.loginFormView.render();
});

