function loginFormView() {
  const modules = [
    './js/config',
    './js/default-view',
    './js/utils',
  ];

  return Promise.all(modules.map(item => require(item))).then(data => {
    const [config, View, utils] = data;

    return new View({
      el: '#logout-form-view',
      template: 'logout-tpl',
      events: {
        'click #logout': initLogout
      }
    });

    function initLogout() {
      utils.post(`${config.API_URL}logout`, {})
      .then(() => {
        this.parent.loginFormView.show();
        this.parent.logoutFormView.hide();
        this.parent.chatView.hide();

        utils.log('logout!');
      })
      .catch(utils.errorHandler);
    }
  });
}
