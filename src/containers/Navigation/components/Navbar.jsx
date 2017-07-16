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
        this.props.setProducts(products);
        this.props.selectProduct(this.props.selectedProductIds[0]);
        initWSConnection(this.props.selectedProductIds, this.props.addProductWSData);
        for (let i = 0; i < this.props.selectedProductIds.length; i += 1) {
          fetchProductData(this.props.selectedProductIds[i], INIT_RANGE, INIT_GRANULARITY, this.props.setProductData);
          setOrderBook(this.props.selectedProductIds[i], this.props.updateOrderBook);
        }
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
      <nav className={`navbar ${this.props.live ? 'live' : ''}`}>
        <a
          className="nav-group"
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/aastein/crypto-trader"
        >
          <img
            alt="logo"
            src="https://avatars0.githubusercontent.com/u/18291415?v=3&s=460"
          />
        </a>
        <ul className="nav-group links">
          <li>
            <NavLink exact activeClassName="active" to="/">Dashboard</NavLink>
          </li>
          <li>
            <NavLink exact activeClassName="active" to="/profile">Profile</NavLink>
          </li>
        </ul>
        <ul className="nav-group orderbook">
          {
            this.props.products.filter(p => (
              this.props.selectedProductIds.indexOf(p.id) > -1
            )).map(a => (
              <li key={a.display_name}>
                <div>
                  <p>{a.display_name}</p>
                  <p>{`Bid: ${a.bid}`}</p>
                  <p>{`Ask: ${a.ask}`}</p>
                </div>
              </li>
          ))}
        </ul>
        <ul className="nav-group-right accounts">
          {this.props.accounts.map(a => (
            <li key={a.currency}>
              <div>
                <p>{a.currency}</p>
                <p>{`Available: ${round(a.available, 6)}`}</p>
                <p>{`Balance: ${round(a.balance, 6)}`}</p>
              </div>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}
