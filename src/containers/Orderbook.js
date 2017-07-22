import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';

import { setLocation } from '../actions';
import { round } from '../utils/math';

class Orderbook extends Component {

  componentDidMount() {
    this.props.setLocation(this.props.location);
  }

  render() {
    return (
      <ul className="orderbook-page">
        {
          this.props.orderbook.map(a => (
            <li key={a.display_name}>
              <div>
                <p>{a.display_name}</p>
                <p>{`Bid: ${a.bid}`}</p>
                <p>{`Ask: ${a.ask}`}</p>
              </div>
            </li>
        ))}
      </ul>
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
