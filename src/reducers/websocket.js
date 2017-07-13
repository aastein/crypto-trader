import * as actionType from '../actions/actionTypes';

const INIT_STATE = {
  connected: false,
  heartbeatTime: 0,
  products: [],
};

const websocket = (state = INIT_STATE, action) => {
  switch (action.type) {
    case actionType.SET_PRODUCTS:
      return { ...state, products: action.products.map(p => ({ id: p.id, data: [] })) };
    case actionType.SET_PRODUCT_WS_DATA:
      console.log(action);
      return { ...state,
        products: state.products.map((p) => {
          const product = p;
          if (p.id === action.id) {
            product.data = [...p.data, action.data];
          }
          return p;
        }),
        connected: true,
        heartbeatTime: action.time,
      };
    default:
      return state;
  }
};

export default websocket;
