const { JSDOM } = require('jsdom');
JSDOM.fromFile("index.html", { runScripts: "dangerously", resources: "usable" }).then(dom => {
  dom.window.console.log = (...args) => console.log('LOG:', ...args);
  dom.window.console.error = (...args) => console.error('ERR:', ...args);
  dom.window.console.warn = (...args) => console.warn('WARN:', ...args);
  setTimeout(() => process.exit(0), 3000);
});
