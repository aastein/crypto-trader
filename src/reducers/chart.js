import * as actionType from '../actions/actionTypes'

let INITAL_CHART_STATE = {
  startDate: '2017-05-29T20:08:43.347Z',
  endDate: '2017-06-29T20:15:15.175Z',
  fetching: false,
  product: '',
  products: []
}

export const chart = (state = INITAL_CHART_STATE, action) => {
  switch(action.type){
    case  actionType.SET_PRODUCTS:
      return {
        ...state, products: action
      }
    case actionType.SET_PRODUCT:
      return {
        ...state, product: action
      }
    case actionType.SET_DATE_RANGE:
      return {
        ...state, startDate: action.startDate, endDate: action.endDate
      }
    default:
      return state
  }
}
