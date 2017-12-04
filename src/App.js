import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Navigation from './containers/Navigation';
import { Dashboard } from './containers/Dashboard';
import Profile from './containers/Profile';

class App extends Component  {
  render() {
    return (
      <div className="App flex-column">
        <Route component={Navigation} />
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/profile" component={Profile} />
          <Route render={() => (<h1 className="not-found">Na Fam</h1>)} />
        </Switch>
      </div>
    )
  }
};


export default App;
