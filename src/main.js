import React from 'react';
import ReactDOM from 'react-dom';
import RedBox from 'redbox-react';
import stores from './stores';
import App from './components/App';

require('./styles/main.scss');

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root');

let render = () => {
  ReactDOM.render(
    <App {...stores} />
    , MOUNT_NODE);
};
// This code is excluded from production bundle
if (module.hot) {
  // Development render functions
  const renderApp = render;
  const renderError = (error) => {
    // const RedBox = require('redbox-react').default;

    ReactDOM.render(<RedBox error={error} />, MOUNT_NODE);
  };

  // Wrap render in try/catch
  render = () => {
    try {
      renderApp();
    } catch (error) {
      console.error(error);
      renderError(error);
    }
  };

  // Setup hot module replacement
  module.hot.accept('./components/App', () =>
    setImmediate(() => {
      ReactDOM.unmountComponentAtNode(MOUNT_NODE);
      render();
    })
  );
}

// ========================================================
// Go!
// ========================================================
render();
