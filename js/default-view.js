function defaultView() {
  function View({ el, template, events = {}, afterRender }) {
    this.el = document.querySelector(el);
    this.template = document.getElementById(template);
    this.events = events;
    this.afterRender = afterRender;
  }

  View.prototype.render = function(callback) {
    this.el.innerHTML = this.template.innerHTML;

    if (typeof callback === 'function') {
      callback.bind(this)();
    }

    if (typeof this.afterRender === 'function') {
      this.afterRender();
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

  return View;
}
