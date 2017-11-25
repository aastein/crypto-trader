import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

class OrderHistory extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  }

  handleClick(e, order) {
    e.preventDefault();
    console.log('canceling order', order.id);
  }

  render() {
    console.log('renderig orders container', this.props);
    return ( this.props.visible &&
      <div className="container d-flex">
        <div className="flex-1">
          <div key="heading" className="columns border-bottom-thick px-2">
            <div className="col-1 text-center">Type</div>
            <div className="col-2 text-center">Size</div>
            <div className="col-2 text-center">Filled (BTC)</div>
            <div className="col-2 text-center">Price (USD)</div>
            <div className="col-2 text-center">Fee (USD)</div>
            <div className="col-1 text-center">Time</div>
            <div className="col-1 text-center">Status</div>
          </div>
          { this.props.orders.map(order => {
              console.log('order', order);
              return (
                <div key={order.id} className="columns border-bottom-light px-2">
                  <div className="col-1 text-center">{order.type}</div>
                  <div className="col-2 text-center">{order.size}</div>
                  <div className="col-2 text-center">{order.filled_size}</div>
                  <div className="col-2 text-center">{Number(order.price).toFixed(2)}</div>
                  <div className="col-2 text-center">{Number(order.fill_fees).toFixed(2)}</div>
                  <div className="col-1 text-center">{moment(order.created_at).fromNow()}</div>
                  <div className="col-1 text-center">{order.status}</div>
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

const OrderHistoryContainer = connect(
  mapStateToProps,
  null,
)(OrderHistory);

export default OrderHistoryContainer;
