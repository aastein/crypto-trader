import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { initApp } from '../../actions/thunks';
import * as selectors from '../../selectors';
import { round } from '../../math';

class Navigation extends Component {

  componentDidMount() {
    this.props.initApp();
  }

  shouldComponentUpdate(nextProps) {
    const accountsChanged = JSON.stringify(this.props.accounts)
      !== JSON.stringify(nextProps.accounts);
    const locationChanged = JSON.stringify(this.props.location)
      !== JSON.stringify(nextProps.location);
    const tickerChanged = JSON.stringify(this.props.tickers)
      !== JSON.stringify(nextProps.tickers);
    const liveChanged = JSON.stringify(this.props.live)
      !== JSON.stringify(nextProps.live);
    return accountsChanged || locationChanged || tickerChanged || liveChanged;
  }

  render() {
    // console.log('rendering Navigation');
    return (
      <nav className={`navbar ${this.props.live ? 'bg-error' : ''}`}>
        <section className="navbar-section">
          <a
            className="logo"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/aastein/crypto-trader"
          >
          <img
            alt="logo"
            src="https://avatars0.githubusercontent.com/u/18291415?v=3&s=50"
          />
          </a>
          <NavLink
            className="btn vcenter"
            exact
            activeClassName="text-dark"
            to="/"
          >
            Dashboard
          </NavLink>
          <NavLink
            className="btn vcenter"
            exact
            activeClassName="text-dark"
            to="/profile"
          >
            Profile
          </NavLink>
          {
            this.props.tickers.map((a,i) => (
              <div className="ticker vcenter hide-md" key={`${i}${a.name}`}>
                <p>{a.name}</p>
                <p>{`Bid: ${a.bid}`}</p>
                <p>{`Ask: ${a.ask}`}</p>
              </div>
          ))}
        </section>
        <section className="navbar-section accounts hide-md">
          {this.props.accounts.map((a, i) => {
            return (<div className="ticker vcenter" key={`${i}${a.currency}`}>
              <p>{a.currency}</p>
              <p className="small">{`Available: ${round(a.available, 6)}`}</p>
              <p className="small">{`Balance: ${round(a.balance, 6)}`}</p>
            </div>)
          })}
        </section>
      </nav>
    );
  }
}

const mapStateToProps = state => {
  const selectedExchange = selectors.selectedExchange(state);
  const tickers = selectors.tickers(selectedExchange);
  const accounts = selectors.accounts(selectedExchange);

  return {
    accounts,
    live: selectedExchange.live,
    location: state.location,
    tickers,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    initApp: () => {
      dispatch(initApp());
    }
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Navigation);
