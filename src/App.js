import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import logo from './logo.svg';
import './App.css';
import Login from './components/Login'
import Navigation from './components/Navigation'
import Home from './components/Home'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navigation />
        <p>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/login' component={Login} />
          <Route render={() => {
            return (<h1 className='not-found'>Na Fam</h1>)
          }} />
        </Switch>
      </div>
    );
  }
}

export default App;
