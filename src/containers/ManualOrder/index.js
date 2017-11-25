import React, { Component } from 'react';
import { connect } from 'react-redux';

class ManualOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      market: true,
      limit: false,
      postOnly: true,
      amount: null,
      price: null,
      buy: true,
      sell: false,
    };
  }

  // only update when state changed because user input
  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(this.nextState) !== JSON.stringify(nextState);
  }

  render() {
    console.log('rendering manual order', this.props);
    return ( this.props.visible &&
      <div className="container">
        <div className="columns px-1">
          <button className={`col-6 btn btn-primary ${this.state.market ? 'text-light' : ''}`}>Market</button>
          <button className={`col-6 btn btn-primary ${this.state.limit ? 'text-light' : 'bg-gray'}`}>Limit</button>
        </div>
        <div className="columns px-1">
          <button className={`col-6 btn ${this.state.buy ? 'bg-success' : 'bg-gray'}`}>Buy</button>
          <button className={`col-6 btn ${this.state.sell ? 'bg-error' : 'bg-gray'}`}>Sell</button>
        </div>
        <div className="form-group">
          <label className="form-label">Amount</label>
          <input className="form-input"/>
        </div>
        <div className="form-group">
          <label className="form-label">Price</label>
          <input className="form-input"/>
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
