import * as actionType from '../actions/actionTypes'

const INITAL_PROFILE_STATE = {
  session: '',
  live: false,
  selectedProducts: [
    {label: 'LTC/USD', value:'LTC-USD'},
    //{label: 'BTC/USD', value:'BTC-USD'},
    //{label: 'ETH/USD', value:'ETH-USD'}
  ],
  accounts: [{available: 0, balance: 0, currency: 'USD'}]
}

export const profile = (state=INITAL_PROFILE_STATE, action) => {
  switch(action.type) {
    case actionType.IMPORT_PROFILE:
      return { ...state, ...action.userData.profile }
    case actionType.SAVE_PROFILE:
      return { ...state, ...action.settings.profile }
    case actionType.UPDATE_ACCOUNTS:
      return { ...state, accounts: action.accounts }
    default:
      return state
  }
}
