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
};

const profile = (state = INITAL_PROFILE_STATE, action) => {
  switch (action.type) {
    case actionType.SET_ORDERS:
      console.log(action);
      const orders = { ...state.orders };
      orders[action.product] = action.orders;
      return { ...state,
        orders,
      };
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
