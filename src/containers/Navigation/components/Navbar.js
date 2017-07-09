import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { getAccounts } from '../../../utils/api'

export default class Navigation extends Component {

  componentDidMount(){

    setInterval(() => {
      if(this.props.session.length > 5){
        getAccounts(this.props.session).then((res) => {
          this.props.updateAccounts(res)
        })
      }
    }, 30000)
  }

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
          <div className='accounts'>
            <ul>
              {this.props.accounts.map( a => (
                <li>
                  <div>
                    <label>{a.currency}</label>
                    <span>{`Available: ${a.available}`}</span>
                    <span>{`Balance: ${a.balance}`}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}
