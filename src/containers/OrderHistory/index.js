import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import {
  cancelOrder,
} from '../../actions';

class OrderHistory extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  }

  handleClick(e, order) {
    e.preventDefault();
    console.log('canceling order', order.id);
    this.props.cancelOrder(order);
  }

  render() {
    console.log('renderig orders container', this.props);
    return ( this.props.visible &&
      <div className="container d-flex">
        <div className="flex-1">
          <div key="heading" className="columns border-bottom-thick px-2">
            <div className="col-1 text-center text-light">Type</div>
            <div className="col-2 text-center text-light">Size</div>
            <div className="col-2 text-center text-light">Filled (BTC)</div>
            <div className="col-2 text-center text-light">Price (USD)</div>
            <div className="col-2 text-center text-light">Fee (USD)</div>
            <div className="col-1 text-center text-light">Time</div>
            <div className="col-1 text-center text-light">Status</div>
          </div>
          { this.props.orders.map(order => {
              console.log('order', order);
              return (
                <div key={order.id} className="columns border-bottom-light px-2">
                  <div className="col-1 text-center text-light">{order.type}</div>
                  <div className="col-2 text-center text-light">{order.size}</div>
                  <div className="col-2 text-center text-light">{order.filled_size}</div>
                  <div className="col-2 text-center text-light">{Number(order.price).toFixed(2)}</div>
                  <div className="col-2 text-center text-light">{Number(order.fill_fees).toFixed(2)}</div>
                  <div className="col-1 text-center text-light">{moment(order.created_at).fromNow()}</div>
                  <div className="col-1 text-center text-light">{order.status}</div>
                  <button className="col-1 btn bg-error btn-order" onClick={(e) => { this.handleClick(e, order)}}>Cancel</button>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const content = 'Orders';
  const visible = state.view.bottomLeft.find(c => (c.id === content)).selected;
  const selectedProduct = state.chart.products.find(p => {
    return p.active;
  });
  const orders = selectedProduct ? state.profile.orders[selectedProduct.id] : [];

  return ({
    content,
    visible,
    orders: orders ? orders : [],
  })
};

const mapDispatchToProps = dispatch => (
  {
    cancelOrder: (order) => {
      dispatch(cancelOrder(order));
    },
  }
);

const OrderHistoryContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrderHistory);

export default OrderHistoryContainer;
