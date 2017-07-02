import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import App from './App';
import reducer from './reducers'
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css'
import 'react-select/dist/react-select.css';
import '../node_modules/react-toggle-switch/dist/css/switch.min.css';
import './index.css'


let store = createStore(reducer)

render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();
