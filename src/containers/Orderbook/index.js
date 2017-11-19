import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import CardHeader from '../CardHeader';

class Orderbook extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  }

  render() {
    return ( this.props.visible &&
      <div className="card log">
        <CardHeader position={this.props.position} contentOptions={this.props.contentOptions}/>
        <div className="card-body order-book">
          { this.props.asks &&
          <div className="orderbook-row asks">
          { this.props.asks.map((ask, i) => (
            <p className="" key={i}>
              <span className="ask size">{`${ask.size}`}</span>
              <span className="ask price">{`${ask.price}`}</span>
            </p>
          ))}
          </div>
          }
          { this.props.asks && this.props.asks.length > 0 &&
            <div className="orderbook-row">
              <p>
                <span>SPREAD</span>
                <span className="float-right">
                  ${parseFloat(this.props.asks[this.props.asks.length - 1].price)
                      - parseFloat(this.props.bids[this.props.bids.length - 1].price)}
                </span>
              </p>
            </div>
          }
          { this.props.bids &&
          <div className="orderbook-row bids">
          { this.props.bids.map((bid, i) => (
            <p className="" key={i}>
              <span className="bid size">{`${bid.size}`}</span>
              <span className="bid price">{`${bid.price}`}</span>
            </p>
          )).reverse()}
          </div> }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const content = 'Order Book';
  const contentOptions = state.view.topRight.map(c => (c.id));
  const visible = state.view.topRight.find(c => (c.id === content)).selected;

  const selectedWebsocket = state.websocket.products.find(p => {
    return p.active;
  });

  const asks = selectedWebsocket && selectedWebsocket.asks ? selectedWebsocket.asks.slice(selectedWebsocket.asks.length - 51, selectedWebsocket.asks.length - 1) : [];
  const bids = selectedWebsocket && selectedWebsocket.bids ? selectedWebsocket.bids.slice(selectedWebsocket.bids.length - 51, selectedWebsocket.bids.length - 1) : [];

  return ({
    contentOptions,
    content,
    visible,
    asks,
    bids,
  })
};

const OrderbookContainer = connect(
  mapStateToProps,
  null,
)(Orderbook);

export default OrderbookContainer;
