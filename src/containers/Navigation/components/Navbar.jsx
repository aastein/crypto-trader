import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import moment from 'moment';

import { getAccounts, getProducts, fetchProductData, setOrderBook } from '../../../utils/api';
import initWSConnection from '../../../utils/websocket';
import { INIT_RANGE, INIT_GRANULARITY } from '../../../utils/constants';

export default class Navigation extends Component {

  componentDidMount() {
    getProducts().then((products) => {
      if (products) {
        const productIds = products.map(p => (p.id));
        this.props.setProducts(products);
        this.props.selectProduct('LTC-USD');
        initWSConnection(productIds, this.props.setProductWSData);
        fetchProductData('LTC-USD', INIT_RANGE, INIT_GRANULARITY, this.props.setProductData);
        setOrderBook('LTC-USD', this.props.updateOrderBook);
      }
    });

    setInterval(() => {
      if (this.props.session.length > 5) {
        getAccounts(this.props.session).then((res) => {
          this.props.updateAccounts(res);
        });
      }
    }, 5000);

    setInterval(() => {
      const ids = this.props.selectedProductIds;
      for (let i = 0; i < ids.length; i += 1) {
        setOrderBook(ids[i], this.props.updateOrderBook);
      }
    }, 30000);

    setInterval(() => {
      if (moment().unix() - moment(this.props.websocket.heartbeatTime).unix() > 30) {
        this.props.updateHeartbeat(false);
      }
    }, 10000);
  }

  render() {
    const round = (value, decimals) => (
      Number(Math.round(Number(`${value}e${decimals}`)) + `e-${decimals}`)
    );

    return (
      <nav className={`navbar navbar-inverse navbar-fixed-top ${this.props.live ? 'live' : ''}`}>
        <div className="container nav-container">
          <div className="navbar-header">
            <a
              className="navbar-brand"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/aastein/crypto-trader"
            >
              <img
                alt="logo"
                className="navbar-brand-img"
                height="50"
                src="https://avatars0.githubusercontent.com/u/18291415?v=3&s=460"
              />
            </a>
          </div>
          <ul className="nav navbar-nav">
            <li>
              <NavLink exact activeClassName="active" to="/">Dashboard</NavLink>
            </li>
            <li>
              <NavLink exact activeClassName="active" to="/profile">Profile</NavLink>
            </li>
          </ul>
          <div className="order-book">
            <ul>
              {
                this.props.products.filter(p => (
                  this.props.selectedProductIds.indexOf(p.id) > -1
                )).map(a => (
                  <li key={a.display_name}>
                    <div>
                      <span>{a.display_name}</span>
                      <span>{`Bid: ${a.bid}`}</span>
                      <span>{`Ask: ${a.ask}`}</span>
                    </div>
                  </li>
              ))}
            </ul>
          </div>
          <div className="accounts">
            <ul>
              {this.props.accounts.map(a => (
                <li key={a.currency}>
                  <div>
                    <span>{a.currency}</span>
                    <span>{`Available: ${round(a.available, 6)}`}</span>
                    <span>{`Balance: ${round(a.balance, 6)}`}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
