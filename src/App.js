import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import './App.css';
import Navigation from './components/Navigation'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navigation />
        <Switch>
          <Route exact path='/' component={Login} />
          <Route exact path='/dashboard' component={Dashboard} />
          <Route render={() => {
            return (<h1 className='not-found'>Na Fam</h1>)
          }} />
        </Switch>
      </div>
    );
  }
}

export default App;
