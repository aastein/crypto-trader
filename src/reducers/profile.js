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
    case actionType.ADD_ORDER:
      return { ...state,
        orders: [...state.orders,
          {
            id: action.id,
            time: action.time,
            price: action.price,
          },
        ],
      };
    case actionType.IMPORT_PROFILE:
      return { ...state, ...action.userData.profile };
    case actionType.SAVE_PROFILE:
      return { ...state, ...action.settings.profile };
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
