import moment from 'moment';

import * as actionType from '../actions/actionTypes';

const INIT_STATE = {
  connected: false,
  heartbeatTime: 0,
  products: [
    { id: 'LTC-EUR', data: [] },
    { id: 'LTC-BTC', data: [] },
    { id: 'BTC-GBP', data: [] },
    { id: 'BTC-EUR', data: [] },
    { id: 'ETH-EUR', data: [] },
    { id: 'ETH-BTC', data: [] },
    { id: 'LTC-USD', data: [] },
    { id: 'BTC-USD', data: [] },
    { id: 'ETH-USD', data: [] },
  ],
};

const websocket = (state = INIT_STATE, action) => {
  switch (action.type) {
    // This is to set the products array.
    // case actionType.SET_PRODUCTS:
    //   return { ...state, products: action.products.map(p => ({ id: p.id, data: [] })) };
    case actionType.SELECT_PRODUCT:
      return { ...state,
        products: state.products.map((p) => {
          const product = { ...p };
          product.active = p.id === action.id;
          return product;
        }),
      };
    case actionType.ADD_PRODUCT_WS_DATA:
      return { ...state,
        products: state.products.map((p) => {
          const product = { ...p };
          if (product.id === action.data.product_id && action.data.price && action.data.size) {
            product.data = [...product.data,
              {
                ...action.data,
                time: moment(action.data.time).valueOf(),
                size: Number(action.data.size),
                price: Number(action.data.price),
              }];
            // if multiple transactions per ms, average the transactions
            const cleanData = [];
            for (let i = 0; i < product.data.length; i += 1) {
              const d = product.data[i];
              if (product.data[i + 1] && product.data[i].time === product.data[i + 1].time) {
                d.price = (d.price + product.data[i + 1].price) / 2;
                d.size = (d.size + product.data[i + 1].size) / 2;
                i += 1;
              }
              cleanData.push(d);
            }
            product.data = cleanData;
          }
          return product;
        }),
        connected: true,
        heartbeatTime: action.time,
      };
    case actionType.SET_PRODUCT_WS_DATA:
      return { ...state,
        products: state.products.map((p) => {
          const product = { ...p };
          if (p.id === action.id) {
            product.data = action.data;
          }
          return product;
        }),
      };
    case actionType.SET_ORDER_BOOK:
      // console.log('reducer/chart.js handle set orderbook',action);
      return { ...state,
        products: state.products.map(p => (
          { ...p,
            asks: p.id === action.id
              ? action.orderBook.asks.sort((a, b) => {
                  if (a.price > b.price) return -1;
                  if (a.price < b.price) return 1;
                  return 0;
                }).slice(action.orderBook.asks.length - 100, action.orderBook.asks.length -1)
              : p.asks,
            bids: p.id === action.id
            ? action.orderBook.bids.sort((a, b) => {
                if (a.price > b.price) return -1;
                if (a.price < b.price) return 1;
                return 0;
              }).slice(0, 100)
            : p.bids,
          }
        )),
      };
    case actionType.UPDATE_ORDER_BOOK:
      // console.log('update order book reducer handler', action);
      // clone bids, then update bids with buys
      const bids = { ...state.products.find(p => {
        return p.id === action.id;
      }) }.bids.slice(0);
      // clone asks, then update asks with sells
      const asks = { ...state.products.find(p => {
        return p.id === action.id;
      }) }.asks.slice(0);

      // sort all data highest price to lowest price
      for (let i = 0; i < action.changes.length; i +=1 ) {
        const data = { price: parseFloat(action.changes[i][1]), size: parseFloat(action.changes[i][2]) }

        if (action.changes[i][0] === 'buy') {
          // insert or update bids
          let index = bids.findIndex((bid) => {
              // eslint-disable-next-line
              return bid.price == action.changes[i][1];
          });
          if (index > -1) {
            // update bid
            // eslint-disable-next-line
            if (action.changes[i][2] == 0) {
              bids.splice(index, 1);
            } else {
              bids.splice(index, 1,  { ...data });
            }
          // eslint-disable-next-line
          } else if (action.changes[i][2] != 0) {
            index = bids.findIndex((bid) => {
                return bid.price < action.changes[i][1];
            });
            // insert bid
            bids.splice(index, 0, { ...data });
          }
        } else if (action.changes[i][0] === 'sell' ) {
          // insert or update asks
          let index = asks.findIndex((ask) => {
              // eslint-disable-next-line
              return ask.price == action.changes[i][1];
          });
          if (index > -1) {
            // update ask
            // eslint-disable-next-line
            if (action.changes[i][2] == 0) {
              asks.splice(index, 1);
            } else {
              asks.splice(index, 1, { ...data });
            }
            // eslint-disable-next-line
          } else if (action.changes[i][2] != 0) {
            index = asks.findIndex((ask) => {
                return ask.price < action.changes[i][1];
            });
            // insert ask
            asks.splice(index, 0, { ...data });
          }
        } else {
          console.error('Unrecognized orderbook udpate from websocket: ', action.changes[i]);
        }
      }

      let deleteCount = asks.length - 100;
      if (deleteCount > 0) asks.splice(0, deleteCount)

      return { ...state,
        products: state.products.map(p => (
          { ...p,
            asks: p.id === action.id
              ? asks
              : p.asks,
            bids: p.id === action.id
              ? bids.slice(0, 100)
              : p.bids,
          }
        )),
      };
    case actionType.UPDATE_HEARTBEAT:
      return { ...state, connected: action.status };
    default:
      return state;
  }
};

export default websocket;
