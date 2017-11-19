import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setLocation } from '../../actions';

class Orderbook extends Component {

  componentDidMount() {
    this.props.setLocation(this.props.location);
  }

  render() {
    console.log('rendering orderbook container');
    return (
      <div className="orderbook-page">
        <ul>
          {
            this.props.orderbook.map(a => (
              <li key={a.display_name}>
                <div>
                  <p>{a.display_name}</p>
                  <p>{`Bid: ${a.bids.length > 0 ? a.bids[0][0] : ''}`}</p>
                  <p>{`Ask: ${a.asks.length > 0 ? a.asks[0][0] : ''}`}</p>
                </div>
              </li>
          ))}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const selectedProductIds = state.profile.selectedProducts.map(p => (p.value));
  return {
    orderbook: state.chart.products.filter(p => (
      selectedProductIds.indexOf(p.id) > -1
    )),
  };
};

const mapDispatchToProps = dispatch => (
  {
    setLocation: (location) => {
      dispatch(setLocation(location));
    },
  }
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Orderbook);
