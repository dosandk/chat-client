function utilsModule() {
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

  return {
    post,
    errorHandler,
    log
  };
}
