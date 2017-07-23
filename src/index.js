import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import 'react-select/dist/react-select.css';
import 'react-toggle-switch/dist/css/switch.min.css';
import App from './App';
import reducer from './reducers';
import './styles/styles.scss';

const composeEnhancers = typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

const getComposeEnhancers = () => {
  if (window.navigator.userAgent.includes('Chrome')) {
    return composeEnhancers(
      applyMiddleware(thunk),
    );
  }
  return compose(applyMiddleware(thunk));
};

const store = createStore(
  reducer,
  getComposeEnhancers(),
);

render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);
