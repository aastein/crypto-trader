import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';

import CardHeader from '../CardHeader';

class Orderbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrolled: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  }

  componentDidUpdate(prevProps) {
    if (!this.props.visible && this.state.scrolled) {
      this.setState(() => (
        { scrolled: false }
      ));
    }
    if (this.focus && !this.state.scrolled) {
      const node = ReactDOM.findDOMNode(this.focus);
      if (node) {
        node.scrollIntoView(false);
        this.setState(() => (
          { scrolled: true }
        ));
      }
    }
  }

  barWidth(size) {
    return {
      backgroundColor: 'red',
      height: '14px',
      // width: `${size * 2}px`,
    }
  }

  render() {
    return ( this.props.visible &&
      <div className="card log">
        <CardHeader position={this.props.position} contentOptions={this.props.contentOptions}/>
        <div className="card-body order-book">
          { this.props.asks &&
          <div className="orderbook-row asks">
          { this.props.asks.map((ask, i) => (
            <p className="" key={i} >
              <span className="ask bar-container"><span style={this.barWidth(ask.size)} className="bar"/></span>
              <span className="ask size">{`${(ask.size)}`}</span>
              <span className="ask price">{`$ ${ask.price}`}</span>
            </p>
          ))}
          </div>
          }
          { this.props.asks && this.props.asks.length > 0 &&
            <div className="orderbook-row spread">
              <p>
                <span>SPREAD</span>
                <span className="float-right">
                  ${(this.props.asks[this.props.asks.length - 1].price
                      - this.props.bids[0].price).toFixed(2) }
                </span>
              </p>
            </div>
          }
          { this.props.bids &&
          <div className="orderbook-row bids">
          { this.props.bids.map((bid, i) => (
            <p className="" key={i} ref={(c) => { if (i === 7) this.focus = c; }}>
              <span className="bid bar-container"><span className="bar"/></span>
              <span className="bid size">{`${bid.size}`}</span>
              <span className="bid price">{`$ ${bid.price}`}</span>
            </p>
          ))}
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

  const asks = selectedWebsocket && selectedWebsocket.asks ? selectedWebsocket.asks.slice(selectedWebsocket.asks.length - 25, selectedWebsocket.asks.length - 0) : [];
  const bids = selectedWebsocket && selectedWebsocket.bids ? selectedWebsocket.bids.slice(0, 25) : [];

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
