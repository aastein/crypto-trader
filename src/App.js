import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import Navigation from './containers/Navigation'
import Dashboard from './components/Dashboard'
import Profile from './containers/Profile'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navigation />
        <Switch>
          <Route exact path='/' component={Dashboard} />
          <Route exact path='/profile' component={Profile} />
          <Route render={() => {
            return (<h1 className='not-found'>Na Fam</h1>)
          }} />
        </Switch>
      </div>
    );
  }
}

export default App;
