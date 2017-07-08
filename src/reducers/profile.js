import * as actionType from '../actions/actionTypes'

const INITAL_PROFILE_STATE = {
  session: '',
  live: false,
  selectedProducts: [
    {label: 'LTC/EUR', value:'LTC-EUR'},
    {label: 'LTC/BTC', value:'LTC-BTC'},
    {label: 'BTC/GBP', value:'BTC-GBP'},
    {label: 'BTC/EUR', value:'BTC-EUR'},
    {label: 'ETH/EUR', value:'ETH-EUR'},
    {label: 'ETH/BTC', value:'ETH-BTC'},
    {label: 'LTC/USD', value:'LTC-USD'},
    {label: 'BTC/USD', value:'BTC-USD'},
    {label: 'ETH/USD', value:'ETH-USD'}
  ]
}

export const profile = (state=INITAL_PROFILE_STATE, action) => {
  switch(action.type) {
    case actionType.IMPORT_PROFILE:
      return { ...state, ...action.userData.profile }
    case actionType.SAVE_PROFILE:
      console.log(action.settings)
      return { ...state, ...action.settings.profile }
    default:
      return state
  }
}
