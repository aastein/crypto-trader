import React, { Component } from 'react';
import { connect } from 'react-redux';

class ManualOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderType: {
        market: true,
        limit: false,
      },
      side: {
        buy: true,
        sell: false,
      },
      appOrderType: {
        manual: true,
        bestPrice: false,
        activeBestPrice: false,
      },
      postOnly: true,
      amount: null,
      price: null,
    };
  }

  // only update when state changed because user input
  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(this.nextState) !== JSON.stringify(nextState);
  }

  handleInputChange(event, key) {
    const value = event.target.value;
    const state = this.state;
    state[key] = value;
    this.setState(() => ({ ...state }));
  }

  // make key in parent in state true, else false
  handleClick(event, parent, key) {
    event.preventDefault();
    const keyValues = Object.keys(this.state[parent]).reduce((kvs, k)=> {
      const o = {};
      o[k] = k === key;
      return { ...kvs, ...o };
    }, {});
    const state = { ...this.state };
    state[parent] = keyValues;
    this.setState(() => ({ ...state }));
  }

  handleOrder(event) {
    event.preventDefault();
    console.log('placing order', this.state);
  }

  totalPrice() {
    const amount = this.state.amount;
    let price;
    if(this.state.orderType.limit) {
      if (this.state.appOrderType.manual) {
        price = this.state.price;
      } else if (this.state.appOrderType.bestPrice || this.state.appOrderType.activeBestPrice) {
         if (this.state.side.buy) {
          price = this.props.bid;
        } else if (this.state.side.sell) {
          price = this.props.ask;
        }
      }
    } else if (this.state.orderType.market) {
      if (this.state.side.buy) {
        price = this.props.ask;
      } else if (this.state.side.sell) {
        price = this.props.bid;
      }
    }
    return amount * price;
  }

  render() {
    console.log('rendering manual order', this.props);
    return ( this.props.visible &&
      <div className="container">
        <div className="columns px-1">
          <button onClick={(e) => {this.handleClick(e, 'orderType', 'market')}} className={`col-6 btn order ${this.state.orderType.market ? '' : 'text-gray bg-dark'}`}>Market</button>
          <button onClick={(e) => {this.handleClick(e, 'orderType', 'limit')}} className={`col-6 btn order ${this.state.orderType.limit ? '' : 'text-gray bg-dark'}`}>Limit</button>
        </div>
        <div className="columns px-1">
          <button onClick={(e) => {this.handleClick(e, 'side', 'buy')}} className={`col-6 btn buy ${this.state.side.buy ? 'bg-green' : 'text-gray bg-dark'}`}>Buy</button>
          <button onClick={(e) => {this.handleClick(e, 'side', 'sell')}} className={`col-6 btn sell ${this.state.side.sell ? 'bg-red' : 'text-gray bg-dark'}`}>Sell</button>
        </div>
        {
          this.state.orderType.limit &&
          <div className="columns px-1">
            <button onClick={(e) => {this.handleClick(e, 'appOrderType', 'manual')}} className={`col-4 btn order ${this.state.appOrderType.manual ? '' : 'text-gray bg-dark'}`}>Manual</button>
            <button onClick={(e) => {this.handleClick(e, 'appOrderType', 'bestPrice')}} className={`col-4 btn order ${this.state.appOrderType.bestPrice ? '' : 'text-gray bg-dark'}`}>Best Price</button>
            <button onClick={(e) => {this.handleClick(e, 'appOrderType', 'activeBestPrice')}} className={`col-4 btn order ${this.state.appOrderType.activeBestPrice ? '' : 'text-gray bg-dark'}`}>Active Best Price</button>
          </div>
        }
        <div className="form-group">
          <label className="form-label text-light">Amount</label>
          <input onChange={(e) => {this.handleInputChange(e, 'amount')}} className="form-input"/>
        </div>
        { this.state.orderType.limit && this.state.appOrderType.manual &&
          <div className="form-group">
            <label className="form-label text-light">Price $</label>
            <input onChange={(e) => {this.handleInputChange(e, 'price')}} className="form-input"/>
          </div>
        }
        { this.state.orderType.limit && (this.state.appOrderType.bestPrice || this.state.appOrderType.activeBestPrice) &&
          <div className="form-group">
            <label className="form-label text-light">{`Price $${ this.state.amount * (this.state.side.buy ? this.props.bid : this.props.ask) }`}</label>
          </div>
        }
        <div className="form-group">
          <label className="form-label text-light">{`Total $${this.totalPrice()}`}</label>
        </div>
        <div className="columns px-1">
          <button className="col-6 col-mx-auto btn">Place Order</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const content = 'Trade';
  const visible = state.view.bottomRight.find(c => (c.id === content)).selected;

  const selectedProduct = state.chart.products.find(p => {
    return p.active;
  });

  let bid = '';
  let ask = '';
  if (selectedProduct) {
    const ticker = state.websocket.products.find(wsProduct => wsProduct.id === selectedProduct.id).ticker;
    bid = ticker ? ticker.bestBid : bid;
    ask = ticker ? ticker.bestAsk : ask;
  }

  return ({
    content,
    visible,
    ask,
    bid,
  })
};

const ManualOrderContainer = connect(
  mapStateToProps,
  null,
)(ManualOrder);

export default ManualOrderContainer;
