import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { initApp } from '../../actions/thunks';
import * as selectors from '../../selectors';
import { round } from '../../math';

class Navigation extends Component {

  compnentDidMount() {
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
            this.props.tickers.map(a => (
              <div className="ticker vcenter hide-md" key={a.name}>
                <p>{a.name}</p>
                <p>{`Bid: ${a.bid}`}</p>
                <p>{`Ask: ${a.ask}`}</p>
              </div>
          ))}
        </section>
        <section className="navbar-section accounts hide-md">
          {this.props.accounts.map(a => (
            <div className="ticker vcenter" key={a.currency}>
              <p>{a.currency}</p>
              <p className="small">{`Available: ${round(a.available, 6)}`}</p>
              <p className="small">{`Balance: ${round(a.balance, 6)}`}</p>
            </div>
          ))}
        </section>
      </nav>
    );
  }
}

Navigation.propTypes = {
  live: PropTypes.bool.isRequired,
  accounts: PropTypes.arrayOf(PropTypes.object).isRequired,
  ticker: PropTypes.arrayOf(PropTypes.object),
  location: PropTypes.object.isRequired,
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
