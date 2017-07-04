import * as actionType from '../actions/actionTypes'
import moment from 'moment'

let INITAL_CHART_STATE = {
  startDate: '2017-01-02T00:00:00.000Z',
  endDate: moment().toISOString(),
  fetching: false,
  product: '',
  products: []
}

export const chart = (state = INITAL_CHART_STATE, action) => {
  switch(action.type){
    case  actionType.SET_PRODUCTS:
      return {
        ...state, products: action.products
      }
    case actionType.SET_PRODUCT:
      return {
        ...state, product: action.product
      }
    case actionType.SET_DATE_RANGE:
      return {
        ...state, startDate: action.startDate, endDate: action.endDate
      }
    case actionType.SET_PRODUCT_DATA:
      return {
        ...state,
        products: state.products.map( product => {
          if(product.id === action.id){
            let data = product.data ? [...product.data, ...action.data] : action.data
            data = data && data.length ? data : []
            let dates = []
            data = data.filter( d => {
              let isDupe = dates.indexOf(d.time) > 0
              dates.push(d.time)
              return !isDupe
            }).sort((a, b) => {
                if(a.time < b.time) return -1;
                if(a.time > b.time) return 1;
                return 0;
            })
            return { ...product, data}
          }
          return product
        })
      }
    case actionType.SET_PRODUCT_WS_DATA:
      return {
        ...state,
        products: state.products.map( product => {
          if(product.id === action.id){
            let ws_data = product.ws_data ? [...product.ws_data, ...action.ws_data] : action.ws_data
            ws_data = ws_data && ws_data.length ? ws_data : []
            let dates = []
            ws_data = ws_data.filter( d => {
              let isDupe = dates.indexOf(d.time) > 0
              dates.push(d.time)
              return !isDupe
            }).sort((a, b) => {
                if(a.time < b.time) return -1;
                if(a.time > b.time) return 1;
                return 0;
            })
            return { ...product, ws_data}
          }
          return product
        })
      }
    default:
      return state
  }
}
