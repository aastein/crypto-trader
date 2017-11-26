import * as actionType from '../actions/actionTypes';

const INITAL_PROFILE_STATE = {
  session: '',
  live: false,
  selectedProducts: [
    { label: 'BTC/USD', value: 'BTC-USD' },
    { label: 'LTC/USD', value: 'LTC-USD' },
    { label: 'ETH/USD', value: 'ETH-USD' },
  ],
  accounts: [{ available: 0, balance: 0, currency: 'USD' }],
  orders: [],
  activeOrders: [],
};

const profile = (state = INITAL_PROFILE_STATE, action) => {
  const activeOrders = { ...state.activeOrders };
  switch (action.type) {
    case actionType.SET_ORDERS:
      console.log(action);
      const orders = { ...state.orders };
      orders[action.product] = action.orders;
      return { ...state,
        orders,
      };
    case actionType.ADD_ACTIVE_ORDER:
      console.log(state, action);
      if (state.activeOrders[action.productId]) {
        activeOrders[action.productId] = [ ...activeOrders[action.productId], action.order ];
      } else {
        activeOrders[action.productId] = [ action.order ];
      }
      console.log('profile reducer, add act order.', activeOrders);
      return { ...state, activeOrders };
    case actionType.DELETE_ACTIVE_ORDER:
      console.log(state, action);
      const activeOrdersForProduct = state.activeOrders[action.productId];
      if (activeOrdersForProduct) {
        const index = activeOrdersForProduct.find(o => (o.id === action.orderId));
        if (index > -1) {
          activeOrdersForProduct.splice(index, 1);
        }
      }
      activeOrders[action.productId] = activeOrdersForProduct;
      return { ...state,  activeOrders};
    case actionType.IMPORT_PROFILE:
      return { ...state, ...action.userData.profile };
    case actionType.SAVE_PROFILE:
      return { ...state, ...action.settings };
    case actionType.SAVE_SESSION:
      return { ...state, session: action.session };
    case actionType.UPDATE_ACCOUNTS:
      if (action.accounts) {
        return { ...state, accounts: action.accounts };
      }
      return state;
    default:
      return state;
  }
};

export default profile;
