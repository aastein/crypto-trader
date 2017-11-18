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

const initialState = () => {
  const local = JSON.parse(localStorage.getItem('redux'))
  return typeof local === 'object' ? localStorage.getItem('redux') : {};
}

const store = createStore(
  reducer,
  // JSON.parse(initialState()),
  getComposeEnhancers(),
);

let lastState = initialState();

store.subscribe(function () {
  var state = store.getState();
  try {
    const writenState = JSON.stringify({ ...state,
      chart: null,
      websocket: null,
    });
    if (writenState !== lastState) {
       console.log('Writing new state to localStorage with length: ',writenState.length);
       localStorage.setItem('redux', writenState);
       lastState = writenState;
    }
  } catch (e) {
    console.warn('Unable to persist state to localStorage:', e);
  }
});

render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);
