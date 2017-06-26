import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

export default class Navigation extends Component {
  render() {
    return (
      <ul className='nav'>
        <li>
          <NavLink exact activeClassName='active' to='/'>Home</NavLink>
        </li>
        <li>
          <NavLink activeClassName='active' to='/pageOne'>Charts</NavLink>
        </li>
        <li>
          <NavLink activeClassName='active' to='/pageTwo'>Profile</NavLink>
        </li>
        <li>
          <NavLink exact activeClassName='active' to='/login'>Login</NavLink>
        </li>
      </ul>
    )
  }
}
