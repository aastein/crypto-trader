import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

export default class Navigation extends Component {
  render() {
    return (
      <nav className={`navbar navbar-inverse navbar-fixed-top ${this.props.live ? 'live' : ''}`}>
        <div className='container nav-container'>
          <div className='navbar-header'>
            <a className="navbar-brand" href='https://github.com/aastein/crypto-trader'>
              <img alt='logo' className='navbar-brand-img' height='50' src='https://avatars0.githubusercontent.com/u/18291415?v=3&s=460'/>
            </a>
          </div>
            <ul className='nav navbar-nav'>
              <li>
                <NavLink exact activeClassName='active' to='/'>Dashboard</NavLink>
              </li>
              <li>
                <NavLink exact activeClassName='active' to='/profile'>Profile</NavLink>
              </li>
            </ul>
          </div>
      </nav>
    )
  }
}
