import React, { Component } from 'react'
import { Switch, Route } from 'react-router'
import Main from './Main'
import Profile from './Profile'
import Charts from './Charts'

export default class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={Main}/>
        <Route exact path='/charts' component={Charts}/>
        <Route exact path='/profile' component={Profile}/>
      </Switch>
    )
  }
}
