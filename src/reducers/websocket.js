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
    case actionType.UPDATE_HEARTBEAT:
      return { ...state, connected: action.status };
    default:
      return state;
  }
};

export default websocket;
