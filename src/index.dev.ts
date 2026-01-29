/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
require('./index');

if (module.hot) {
  module.hot.accept(['./index'], () => {
    const { render } = require('./index');
    render();
  });
}
