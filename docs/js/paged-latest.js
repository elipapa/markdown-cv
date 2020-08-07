{
  config = window.PagedConfig || {};
  window.PagedConfig = {auto: false};

  let pagedjs = document.createElement('script');
  pagedjs.src = 'https://unpkg.com/pagedjs/dist/paged.polyfill.js';
  let pagedjsLoaded = new Promise(_ => pagedjs.onload = _);

  let hooks = document.createElement('script');
  hooks.src = document.head
                      .querySelector('script[src*="config.js"]')
                      .src
                      .replace('config', 'hooks');
  let hooksLoaded = new Promise(_ => hooks.onload = _);

  document.head.appendChild(pagedjs);
  pagedjsLoaded.then(() => document.head.appendChild(hooks));
  hooksLoaded.then(async () => {
    if (config.before) await config.before();
    await PagedPolyfill.preview();
    if (config.after) config.after();
  });
}
