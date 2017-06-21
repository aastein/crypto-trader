import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import App from './containers/App'
import reducer from './reducers'

const store = createStore(reducer)

render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('root')
)
