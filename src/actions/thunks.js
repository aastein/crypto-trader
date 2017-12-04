import { floor } from '../math';
import { INIT_RANGE, INIT_GRANULARITY } from '../constants/chart';
import run from '../scripting';
import api from '../api';
import connect, { setActions, subscribeToTicker, subscribeToOrderBook } from '../websocket';
import {
  addActiveOrder,
  addProductData,
  addMatchData,
  deleteActiveOrder,
  setOrders,
  setFills,
  setFetchingStatus,
  setTickerData,
  setOrderBook,
  setProductData,
  setMatchData,
  setProducts,
  selectProduct,
  setAccounts,
  updateOrderBook,
} from './index';


export const placeLimitOrder = (exchange, appOrderType, side, productId, price, amount) => {
  return (dispatch, getState) => {
    // if order is an active order set the price / quantity acording to active order type
    if (appOrderType === 'bestPrice' || appOrderType === 'activeBestPrice') {
      const productWSData = getState().websocket.products.find(wsProduct => wsProduct.id === productId);
      if (side === 'buy') {
        //match highest bid price, first bid.price
        price = productWSData.bids[0].price;
      } else if (side ==='sell') {
        // match lowest ask price, last ask.price
        price = productWSData.asks[productWSData.asks.length - 1].price;
      }
    }
    return api[exchange].postLimitOrder(side, productId, price, amount, getState().profile.session).then(res => {
      console.log('order response', res);
      // add order id to watched order id list, to replace order when needed
      dispatch(fetchOrders(productId));
      dispatch(fetchFills(productId));
      if (res && appOrderType === 'activeBestPrice') {
        dispatch(addActiveOrder(res.product_id, res));
      }
      return res;
    });
  }
}

export const cancelOrder = (exchange, order) => (
  (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      // dispatch(setCancelling(order.product_id, order.id));
      api[exchange].deleteOrder(order.id, getState().profile.session).then(() => {
        console.log('delete order request completed', order);
        dispatch(deleteActiveOrder(order.product_id, order.id));
        dispatch(fetchOrders(order.product_id));
        dispatch(fetchFills(order.product_id));
        resolve();
      })
    });
  }
);

export const fetchAccounts = (exchange, session) => (
  (dispatch, getState) => {
    session = session ? session : getState().profile.session;
    return api[exchange].getAccounts(session).then((accounts) => {
      if (accounts) {
        dispatch(setAccounts(accounts));
        return true;
      }
      return false;
    })
  }
);

export const fetchOrders = (exchange, product, session) => {
  return (dispatch, getState) => {
    session = session ? session : getState().profile.session;
    return api[exchange].getOrders(product, session).then((orders) => {
      dispatch(setOrders(product, orders));
    })
  };
}

export const fetchFills = (exchange, product, session) => {
  return (dispatch, getState) => {
    session = session ? session : getState().profile.session;
    return api[exchange].getFills(product, session).then((fills) => {
      dispatch(setFills(product, fills));
    })
  };
}

export const fetchProductData = (exchange, id, range, granularity) => (
  (dispatch) => {
    dispatch(setFetchingStatus('fetching'));
    return api[exchange].getProductData(id, range, granularity).then((data) => {
      dispatch(setProductData(id, data));
      dispatch(setFetchingStatus('success'));
    }).catch((err) => {
      console.warn(err);
      dispatch(setFetchingStatus('failure'));
    });
  }
);

export const initProducts = () => (
  (dispatch, getState) => (
    api['gdax'].getProducts().then((products) => {
      dispatch(setProducts(products.data));
      const state = getState();
      const selectedProductIds = state.profile.products.map(p => (p.id));
      dispatch(selectProduct(selectedProductIds[0]));
      dispatch(fetchProductData(selectedProductIds[0], INIT_RANGE, INIT_GRANULARITY));
      if (state.profile.session) {
        dispatch(fetchOrders(selectedProductIds[0]));
        dispatch(fetchFills(selectedProductIds[0]));
        dispatch(fetchAccounts(state.profile.session));
      }
      dispatch(initWebsocket(selectedProductIds[0], selectedProductIds));
    })
  )
);

/*
 * Websocket
*/

const transformOrderData = order => {
  return {
    price: parseFloat(order[0]).toFixed(2),
    size: parseFloat(order[1]).toFixed(8),
  }
}

const bestAsk = (getState, productId) => {
  // console.log('getting best ask', productId);
  const wsProductData = getState().websocket.products.find(p => (p.id === productId));
  // console.log('bestAsk is', wsProductData.asks[wsProductData.asks.length - 1].price);
  return wsProductData.asks[wsProductData.asks.length - 1].price;
}

const bestBid = (getState, productId) => {
  const wsProductData = getState().websocket.products.find(p => (p.id === productId));
  return wsProductData.bids[0].price;
}

const ordersBeingHandled = [];

// handles realtime price data
const handleMatch = (exchange, dispatch, getState) => {
  return data => {
    const state = getState();
    const product = state.exchanges[exchange].products.find(p => {
      return p.id === data.product_id;
    });
    const granularity = product.granularity;
    const historicalData = product.data;
    const matchData = product.matches;
    const latestMatchTime = matchData[matchData.length - 1].time;
    const latestHistoricalDataTime = historicalData[historicalData.length - 1].time;

    if (latestMatchTime - latestHistoricalDataTime < granularity * 1000) {
      dispatch(addMatchData(exchange, data));
    } else {
      // bundle websocket data into OHLC and append to historical data given time conditions

      // get data that fits in the next granularity slice
      const matchDataFiltered = matchData.filter((d, i)=> {
        return d.time > latestHistoricalDataTime && d.time < latestHistoricalDataTime + (granularity * 1000) ;
      });

      // prune old websocket data in state
      dispatch(setMatchData(exchange, data.product_id, matchData.filter((d, i)=> {
        return d.time > latestHistoricalDataTime;
      })));

      // compile ws data to OHLC data
      const wsOHLC = matchDataFiltered.reduce((ohlc, d) => (
        {
          ...ohlc,
          high: d.price > ohlc.high ? d.price : ohlc.high,
          low: d.price < ohlc.low ? d.price : ohlc.low,
          volume: d.size + ohlc.volume,
        }
      ), {
        open: matchDataFiltered[0].price,
        high: Number.MIN_SAFE_INTEGER,
        low: Number.MAX_SAFE_INTEGER,
        close: matchDataFiltered[matchDataFiltered.length - 1].price,
        time: matchDataFiltered[matchDataFiltered.length - 1].time,
        volume: 0,
      });
      // add new slice of historical data
      dispatch(addProductData(exchange, data.product_id, wsOHLC));
    }
  }
}

// handles initial orderbook data
const handleSnapshot = (exchange, dispatch) => {
  return data => {
    // console.log('actions/index.js handleSnapshot', data);
    let bids = [];
    for (let i = 0; i < data.bids.length; i +=1 ) {
      if (bids.length > 0 && bids[bids.length - 1][0] === data.bids[i][0]) {
        bids[bids.length - 1].size += parseFloat(data.bids[i][1]).toFixed(8);
      } else if (parseFloat(data.bids[i][1]) > 0) {
        bids.push(transformOrderData(data.bids[i]));
      }
    }
    let asks = [];
    for (let i = 0; i < data.asks.length; i +=1 ) {
      if (asks.length > 0 && asks[asks.length - 1][0] === data.asks[i][0]) {
        asks[asks.length - 1].size += parseFloat(data.asks[i][1]).toFixed(8);
      } else if (parseFloat(data.asks[i][1]) > 0) {
        asks.push(transformOrderData(data.asks[i]));
      }
    }
    dispatch(setOrderBook(exchange, data.product_id, { bids: bids, asks: asks }))
  }
}

// handles new orderbook diff
// BUG - active orders do not get deleted!
const handleUpdate = (exchange, dispatch, getState) => {
  return data => {
    dispatch(updateOrderBook(exchange, data.product_id, data.changes));
    const state = getState();
    const scriptHeader = state.scripts.find(s => (s.id === 0));
    const liveScripts = state.scripts.filter(s => (s.live));
    const activeOrders = state.profile.activeOrders[data.product_id];
    /*
      Run all scripts wich are live
    */
    for (let i = 0; i < liveScripts.length; i +=1 ) {
      run({
        script: scriptHeader.script + ';' + liveScripts[i].script,
      });
    }

    // get best price and update active orders
    /*
      All of the code below this line is for handling canelling and re-placing of active orders
    */

    if (activeOrders && activeOrders.length > 0) {
      // for each active order
      for (let i = 0; i < activeOrders.length; i +=1) {
        const order = { ...activeOrders[i] };
        // console.log('order to update id', order.id);
        // console.log('orders being handled', ordersBeingHandled);
        let orderHandleIndex = ordersBeingHandled.indexOf(order.id);
        // console.log('index of candidate order in handle array', orderHandleIndex);
        if (orderHandleIndex < 0) {
            ordersBeingHandled.push(order.id);
            // console.log('order is handleing added', order.id);
            // if order is sell and order price is greater than bestAsk
          if (order.side === 'sell' && Number(order.price) > bestAsk(getState, order.product_id)) {
            // console.log('cancelling sell order', order);
            // cancel order
            dispatch(cancelOrder(exchange, order)).then(() => {
              // re-place order. keep size constant, adjust price
              order.price = floor(bestAsk(getState, order.product_id), 2);
              // console.log('replacing sell order', order);
              dispatch(placeLimitOrder(exchange, 'activeBestPrice', order.side, order.product_id, order.price, order.size));
              orderHandleIndex = ordersBeingHandled.indexOf(order.id);
              ordersBeingHandled.splice(orderHandleIndex, 1);
              // console.log('order is handleing removed', order.id);
            });
          }
          // if order is buy and order price is less than bestBid
          else if (order.side === 'buy' && Number(order.price) < bestBid(getState, order.product_id)) {
            // cancel order
            dispatch(cancelOrder(exchange, order)).then(() => {
              // re-place order. keep total (price * amount) constant
              const total = order.price * order.size;
              const newPrice = bestBid(getState, order.product_id);
              order.size = floor((total / newPrice), 8);
              order.price = newPrice;
              dispatch(placeLimitOrder(exchange, 'activeBestPrice', order.side, order.product_id, order.price, order.size));
              orderHandleIndex = ordersBeingHandled.indexOf(order.id);
              ordersBeingHandled.splice(orderHandleIndex, 1);
              // console.log('order is handleing removed', order.id);
            });
          } else {
            orderHandleIndex = ordersBeingHandled.indexOf(order.id);
            ordersBeingHandled.splice(orderHandleIndex, 1);
            // console.log('order is handleing removed', order.id);
          }
        }
      }
    }
  }
}

// handles ticker price for all products
const handleTicker = (exchange, dispatch) => {
  return data => {
    dispatch(setTickerData(exchange, data))
  }
}

// when a user's order is matched, delete the order
const handleDeleteOrder = (exchange, dispatch) => {
  return data => {
    dispatch(deleteActiveOrder(exchange, data.product_id, data.order_id));
    dispatch(fetchOrders(exchange, data.product_id));
    dispatch(fetchFills(exchange, data.product_id));
  }
}

// initialize all websocket stuff
export const initWebsocket = (activeId, ids) => (
  (dispatch, getState) => (
    connect().then(() => {
      // pass in methods that the WS will need to call.
      // console.log('initwebsocker', activeId, ids);
      const exchange = 'gdax';
      // pass methods to the websocket onmessage callback to handle websocket data
      setActions(
        handleMatch(exchange, dispatch, getState),
        handleSnapshot(exchange, dispatch),
        handleUpdate(exchange, dispatch, getState),
        handleTicker(exchange, dispatch),
        handleDeleteOrder(exchange, dispatch)
      );
      subscribeToTicker(ids)
      subscribeToOrderBook(activeId, getState().profile.session);
    })
  )
);
