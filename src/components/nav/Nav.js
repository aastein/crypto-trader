import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Nav extends Component {
  render() {
    return (
      <header>
        <nav>
          <li><Link to='/'>Main</Link></li>
          <li><Link to='/charts'>Charts</Link></li>
          <li><Link to='/profile'>Profile</Link></li>
        </nav>
      </header>
    )
  }
}
