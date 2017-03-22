function loginFormView() {
  const modules = [
    './js/config',
    './js/default-view',
    './js/utils'
  ];

  return Promise.all(modules.map(item => require(item))).then(data => {
    const [config, View, utils] = data;

    return new View({
      el: '#login-form-view',
      template: 'login-form-tpl',
      events: {
        'submit #login-form': initLogin
      }
    });

    function initLogin(e) {
      const loginUrl = `${config.API_URL}login`;
      const usernameEl = document.getElementById('username');
      const passEl = document.getElementById('pass');
      const username = usernameEl.value;
      const pass = passEl.value;

      e.preventDefault();

      utils.post(loginUrl, {username, pass})
      .then(response => {
        response.json()
        .then(user => this.parent.user = JSON.stringify(user))
        .catch(utils.errorHandler);

        e.target.reset();

        this.parent.loginFormView.hide();
        this.parent.chatView.render();
        this.parent.logoutFormView.render();
      })
      .catch(utils.errorHandler);
    }

  });
}
