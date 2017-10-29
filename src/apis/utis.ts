export function fetch2(url: string, options={}) {
  // options = {
  //   // your default options
  //   credentials: 'same-origin',
  //   redirect: 'error',
  //   ...options,
  // };

  if(options['params']) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + queryParams(options['params']);
    delete options['params']
  }

  return fetch(url, options);
}

function queryParams(params) {
  return Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
}

