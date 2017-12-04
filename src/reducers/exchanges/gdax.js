import * as actionType from '../../actions/actionTypes';
import calculateIndicators from '../../indicators';
import moment from 'moment';

// implicity defines avalable exchanges using
export const INIT_GDAX_STATE = {
  id: 'gdax',
  name: 'GDAX', // this is only used for display purposes
  persistent: { // this object is persisted in the local state
    session: '', // the secret session ID used to make authenticated requests
  },
  selected: true,
  /* data of this form will be filled in when data is fetched for these categories.
  accounts: [{ available: 0, balance: 0, currency: 'USD' }],
  products: [
    {
      id: 'BTC-USD',
      bids: [],
      asks: [],
      matches: [],
      orders: [],
      activeOrders: [], // actively managed orders
      fills: [],
    },
  ],
  */
};

const gdax = (state = INIT_GDAX_STATE, action) => {
  if (action.exchange === state.id) {
    switch (action.type) {
      // set overall fetching status for exchange APIs
      case actionType.SET_FETCHING_STATUS:
        return { ...state, fetchingStatus: action.status };
      // set date range per product
      case actionType.SET_DATE_RANGE:
        return { ...state,
          products: state.products.map(p => (
            { ...p,
              range: p.id === action.id ? action.range : p.range,
            }
          )),
        };
      // set granularity per product
      case actionType.SET_GRANULARITY:
        return { ...state,
          products: state.products.map(p => (
            { ...p,
              granularity: p.id === action.id ? parseInt(action.granularity, 10) : p.granularity,
            }
          )),
        };
      // set initial products from /produts API response
      case actionType.SET_PRODUCTS:
        // form API response data to general format
        const products = action.proudcts.map(_p => {
          const p = { ..._p };
          return p;
        });
        return { ...state, products };
      // set historical data for a product and calcuate active indicator data for hisorical data
      case actionType.SET_PRODUCT_DATA:
        // console.log(action);
        return { ...state,
          products: state.products.map((p) => {
            const product = { ...p };
            if (product.id === action.id && action.data) {
              let data = [...action.data.data];
              const endDate = action.data.epochEnd * 1000;
              const startDate = endDate - (product.range * 60000); // (minutes * ( ms / minute)*1000)
              const dates = [];
              let lastTime = 0;

              data = data.sort((a, b) => {
                if (a.time < b.time) return -1;
                if (a.time > b.time) return 1;
                return 0;
              }).filter((d) => {
                const isDupe = dates.indexOf(d.time) > 0;
                const isInTimeRange = d.time >= startDate && d.time <= endDate;
                dates.push(d.time);
                if (d.time - lastTime >= product.granularity * 1000) {
                  lastTime = d.time;
                  return true && !isDupe && isInTimeRange;
                }
                return false;
              });
              const inds = calculateIndicators(state.indicators, data);
              return { ...product,
                data,
                ...inds,
              };
            }
            return product;
          }),
        };
      // append single data point to a products historical data
      case actionType.ADD_PRODUCT_DATA:
        // console.log(action);
        return { ...state,
          products: state.products.map((p) => {
            const product = { ...p };
            if (product.id === action.id) {
              const data = [...product.data, action.data];
              const inds = calculateIndicators(state.indicators, data);
              return { ...product,
                data,
                ...inds,
              };
            }
            return product;
          }),
        };
      // calculate indicators for existing historical data
      case actionType.CALCULATE_INDICATORS:
        return { ...state,
          products: state.products.map((p) => {
            const product = { ...p };
            if (product.id === action.id) {
              const inds = calculateIndicators(state.indicators, [...product.data]);
              return { ...product, ...inds };
            }
            return product;
          }),
        };
      // choose to plot data for a specific product by setting the active flag
      case actionType.SELECT_PRODUCT:
        // console.log(action);
        return { ...state,
          products: state.products.map(p => (
            { ...p, selected: p.id === action.id }
          )),
        };
      // set fills (completed orders) by product
      case actionType.SET_FILLS:
        return { ...state,
          products: state.products.map((p) => {
            const product = { ...p };
            if (product.id === action.id) {
              return { ...product, fills: action.fills };
            }
            return product;
          }),
        };
      // set orders (open orders) by product
      case actionType.SET_ORDERS:
        // console.log(action);
        return { ...state,
          products: state.products.map((p) => {
            const product = { ...p };
            if (product.id === action.id) {
              return { ...product, orders: action.orders };
            }
            return product;
          }),
        };
      // add an order which should be activly managed by the app
      case actionType.ADD_ACTIVE_ORDER:
        // console.log('profile reducer, add act order.', activeOrders);
        return { ...state,
          products: state.products.map((p) => {
            const product = { ...p };
            if (product.id === action.id) {
              if (product.activeOrders) {
                return { ...product,
                  activeOrders: [ ...state.activeOrders[action.productId], action.order ]
                };
              } else {
                return { ...product, activeOrders: [ action.order ] };
              }
            }
            return product;
          }),
        };
      // delete an order which was activly managed by the app
      case actionType.DELETE_ACTIVE_ORDER:
        // console.log('new active orders', activeOrders);
        return { ...state,
          products: state.products.map((p) => {
            const product = { ...p };
            if (product.id === action.id) {
              if (product.activeOrders) {
                const activeOrders = { ...product.activeOrders };
                const index = product.activeOrders.findIndex(o => {
                  return o.id === action.orderId
                });
                if (index > -1) {
                  activeOrders.splice(index, 1);
                }
                return { ...product,
                  activeOrders,
                };
              }
            }
            return product;
          }),
        };
      // save the session value used for authenticated API calls
      case actionType.SAVE_SESSION:
        return { ...state,
          persistent: {
            ...state.persistent,
            session: action.session,
          }
        };
      // set account information (currency balances)
      case actionType.SET_ACCOUNTS:
        return { ...state, accounts: action.accounts };
      // add match data, also update heatbeattime and set websocketconnecetd to true
      case actionType.ADD_MATCH_DATA:
        return { ...state,
          products: state.products.map((p) => {
            if (p.id === action.data.product_id) {
              const product = { ...p };
              product.matches = [ ...product.matches,
                {
                  ...action.data,
                  time: moment(action.data.time).valueOf(),
                  size: Number(action.data.size),
                  price: Number(action.data.price),
                }
              ];
              return product;
            }
            return p;
          }),
          websocketConnected: true,
          heartbeatTime: action.time,
        };
      case actionType.SET_MATCH_DATA:
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
          hasOrderBook: true,
          products: state.products.map(p => (
            { ...p,
              asks: p.id === action.id
                ? action.orderBook.asks.sort((a, b) => {
                    const aPrice = parseFloat(a.price);
                    const bPrice = parseFloat(b.price);
                    if (aPrice > bPrice) return -1;
                    if (aPrice < bPrice) return 1;
                    return 0;
                  }) // .slice(action.orderBook.asks.length - maxOrderbookLength, action.orderBook.asks.length - 1)
                : p.asks,
              bids: p.id === action.id
              ? action.orderBook.bids.sort((a, b) => {
                  const aPrice = parseFloat(a.price);
                  const bPrice = parseFloat(b.price);
                  if (aPrice > bPrice) return -1;
                  if (aPrice < bPrice) return 1;
                  return 0;
                }) // .slice(0, maxOrderbookLength)
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

        // note: sort all data highest price to lowest price
        // todo: if new bid, and bid > lowst ask, remove lowest ask.
        //       if new ask, and ask < highest bid, remove hiest bid.
        for (let i = 0; i < action.changes.length; i +=1 ) {
          const data = { price: parseFloat(action.changes[i][1]).toFixed(2), size: parseFloat(action.changes[i][2]).toFixed(8) }

          if (action.changes[i][0] === 'buy') {
            // insert or update bids
            let index = bids.findIndex((bid) => {
                // eslint-disable-next-line
                return parseFloat(bid.price) == parseFloat(action.changes[i][1]);
            });
            if (index > -1) {
              // update bid
              // eslint-disable-next-line
              if (parseFloat(action.changes[i][2]) == 0) {
                bids.splice(index, 1);
              } else {
                bids.splice(index, 1,  { ...data });
              }
            // eslint-disable-next-line
            } else if (parseFloat(action.changes[i][2]) != 0) {
              index = bids.findIndex((bid) => {
                  return parseFloat(bid.price) < parseFloat(action.changes[i][1]);
              });
              if (index === -1) index = bids.length;
              // insert bid
              bids.splice(index, 0, { ...data });
            }
          } else if (action.changes[i][0] === 'sell' ) {
            // insert or update asks
            let index = asks.findIndex((ask) => {
                // eslint-disable-next-line
                return parseFloat(ask.price) == parseFloat(action.changes[i][1]);
            });
            if (index > -1) {
              // update ask
              // console.log('update at index', index);
              // eslint-disable-next-line
              if (parseFloat(action.changes[i][2]) == 0) {
                asks.splice(index, 1);
              } else {
                asks.splice(index, 1, { ...data });
              }
              // eslint-disable-next-line
            } else if (parseFloat(action.changes[i][2]) != parseFloat(0)) {
              index = asks.findIndex((ask) => {
                  return parseFloat(ask.price) < parseFloat(action.changes[i][1]);
              });
              if (index === -1) index = asks.length;
              // insert ask
              // console.log('insert at index', index);
              asks.splice(index, 0, { ...data });
            }
          } else {
            console.error('Unrecognized orderbook udpate from websocket: ', action.changes[i]);
          }
        }

        //let deleteCount = asks.length - maxOrderbookLength;
        //if (deleteCount > 0) asks.splice(0, deleteCount)

        if (asks[asks.length - 1].price > asks[asks.length - 2].price) {
          console.error('asks book broken', asks[asks.length - 1].price, asks[asks.length - 2].price);
          console.log('action', action);
          console.log('asks', { ...state.products.find(p => {
            return p.id === action.id;
          }) }.asks);
        }

        if (bids[1].price > bids[0].price) {
          console.error('bids book broken', bids[1].price, bids[1].price);
          console.log('action', action);
          console.log('bids', { ...state.products.find(p => {
            return p.id === action.id;
          }) }.bids);
        }

        return { ...state,
          products: state.products.map(p => (
            { ...p,
              asks: p.id === action.id
                ? asks
                : p.asks,
              bids: p.id === action.id
                ? bids //.slice(0, maxOrderbookLength)
                : p.bids,
            }
          )),
        };
      case actionType.SET_TICKER_DATA:
        // console.log('reducter/websocket ', action.Type, action);
        return { ...state,
          products: state.products.map(p => {
            // console.log(p, action)
            return { ...p,
              ticker: p.id === action.data.product_id
                ? { bestAsk: Number(action.data.best_ask).toFixed(2), bestBid: Number(action.data.best_bid).toFixed(2) }
                : p.ticker,
            }
          }),
        };
      case actionType.UPDATE_HEARTBEAT:
        return { ...state, connected: action.status };
      default:
        return state;
    }
  } else {
    return state;
  }
};

export default gdax;
