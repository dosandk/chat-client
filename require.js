function require(path) {
  require.counter = require.counter + 1 || 1;

  return fetch(new Request(`${path}.js`, {
    method: 'GET',
    headers: {'Content-type': 'application/javascript'}
  }))
  .then((data) => {
    return data.text()
      .then(result => eval(`(${result}())`))
      .catch(err => console.error(err));
  })
  .catch(err => console.error(err));
}
