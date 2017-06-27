import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

export default class Navigation extends Component {
  render() {
    return (
      <ul className='nav'>
        <li>
          <NavLink exact activeClassName='active' to='/'>Login</NavLink>
        </li>
        <li>
          <NavLink exact activeClassName='active' to='/dashboard'>Dashboard</NavLink>
        </li>
      </ul>
    )
  }
}
