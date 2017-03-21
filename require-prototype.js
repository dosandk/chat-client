function getScript() {
  return fetch(new Request(`${DOMAIN_URL}test.js`, {
    method: 'GET',
    headers: {'Content-type': 'application/javascript'}
  }));
}

getScript()
.then((data) => {
  data.text()
  .then(result => {
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');

    script.type = 'text/javascript';
    script.text = result;

    head.appendChild(script);
  })
  .catch(err => log(err));
})
.catch(err => log(err));
