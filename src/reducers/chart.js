import * as actionType from '../actions/actionTypes'
import { indicators } from '../utils/indicators'

let INITAL_CHART_STATE = {
  dateRanges: [
    { label: '1 minute', value: 1},
    { label: '5 minutes', value: 5},
    { label: '10 minute', value: 10},
    { label: '30 minutes', value: 30},
    { label: '1 hour', value: 60},
    { label: '3 hours', value: 180},
    { label: '6 hours', value: 360},
    { label: '1 day', value: 1440},
    { label: '10 days', value: 14400},
    { label: '30 days', value: 43200}
  ],
  products: []
}

export const chart = (state = INITAL_CHART_STATE, action) => {
  switch(action.type){
    case actionType.SELECT_PRODUCT_DOC:
      return {
        ...state,
        products: state.products.map( p => {
          p.docSelected = p.id === action.id ? !p.docSelected : p.docSelected
          return p
        })
      }
    case actionType.SELECT_DATE_RANGE:
      return {
        ...state,
        products: state.products.map( p => {
          p.range = p.id === action.id ? action.range : p.range
          return p
        })
      }
    case actionType.SET_GRANULARITY:
      return {
        ...state,
        products: state.products.map( product => {
          if(product.id === action.id){
            return { ...product, granularity: parseInt(action.granularity, 10) }
          }
          return product
        })
      }
    case actionType.SET_PRODUCTS:
      return {
        ...state,
        products: action.products.map( p => (
          { ...p, granularity: 60, range: 60, data: [], docSelected: false }
        ))
      }
    case actionType.SELECT_PRODUCT:
      return {
        ...state, products : state.products.map( p => {
          p.active = p.id === action.id
          return p
        })
      }
    case actionType.SET_PRODUCT_DATA:
    //  console.log('set product data size', action.data.data.length)
      return {
        ...state,
        products: state.products.map( product => {
          if(product.id === action.id && action.data ){

            let data = [ ...action.data.data ]
            let endDate = action.data.epochEnd * 1000
            let startDate = endDate - product.range * 60000 // ( minutes * ( ms / minute) * 1000)
            let dates = []
            let lastTime = 0

            data = data.sort((a, b) => {
                if(a.time < b.time) return -1;
                if(a.time > b.time) return 1;
                return 0;
            }).filter( d => {

              let isDupe = dates.indexOf(d.time) > 0
              //if(isDupe) console.log('duplicate data')
              let isInTimeRange = d.time >= startDate && d.time <= endDate
              //if(!isInTimeRange) console.log('data outside of range')

              dates.push(d.time)

              if(d.time - lastTime >= product.granularity * 1000){
                lastTime = d.time
                return true && !isDupe && isInTimeRange
              }
              return false
            })
            let inds = indicators(14, 3, data)
            return { ...product, data, srsi: inds.srsi, rsi: inds.rsi, cci: inds.cci}
          }
          return product
        })
      }
    case actionType.SET_PRODUCT_WS_DATA:
      // add new ws_data to product
      // after ws_data is sorted, remove all that are 5min(300000ms) after newest ws_data
      // if newst ws_data is 1min + last data.time, calculate ohlc and add to data with time = latest ws_time
      //console.log('')
      /*
      time: 1499396513781
      price: 2590.02
      size: 0.35052233
      */
      return {
        ...state,

        products: state.products.map( product => {

          if(product.id === action.id){

            // get procut historical data
            let data = product.data ? [ ...product.data ] : []

            // get time of newest product historical data
            let newestdatatime =  data[data.length - 1] && data[data.length - 1].time ? data[data.length - 1].time : null

            // get all web socket data for product
            let ws_data = product.ws_data ? [...product.ws_data, ...action.ws_data] : action.ws_data

            // if web socket data is not array, set it to empty array
            ws_data = ws_data && ws_data.length ? ws_data : []

            // get time of oldest and newest web socket data
            let newestwsdatatime = ws_data[ws_data.length - 1].time ? ws_data[ws_data.length - 1].time : null
            let oldestwsdatatime = ws_data[0].time ? ws_data[0].time : null

            // sort by time, newest data on top
            ws_data = ws_data.sort((a, b) => {
                if(a.time < b.time) return -1;
                if(a.time > b.time) return 1;
                return 0;
            }).filter(d => {
              if(oldestwsdatatime){
                // filter out data older than granularity time
                return (newestwsdatatime - d.time < product.granularity * 1000)
              }
              return true
            })

            // if multiple transactions per ms, avaerage the transactions
            let clean_ws_data = []
            if(ws_data.length > 1){
              for(let i = 0; i < ws_data.length; i++ ){
                let d = ws_data[i]
                if(ws_data[i + 1] && ws_data[i].time === ws_data[i + 1].time){
                  d.price = (d.price  + ws_data[i + 1].price) / 2
                  d.size = (d.size + ws_data[i + 1].size) / 2
                  i++
                }
                clean_ws_data.push(d)
              }
            } else {
              clean_ws_data = [ ...ws_data ]
            }

            if(oldestwsdatatime && newestdatatime && (newestwsdatatime - newestdatatime >= product.granularity * 1000)){
              //console.log('compiling ws data to data')
              let newdata = [ ...clean_ws_data ]
              newdata = newdata.reduce((ohlc, d) => {
                return {
                  ...ohlc,
                  high: d.price > ohlc.high ? d.price : ohlc.high,
                  low: d.price < ohlc.low ? d.price : ohlc.low,
                  volume: d.size + ohlc.volume
                }
              }, {
                open: clean_ws_data[clean_ws_data.length - 1].price,
                high: Number.MIN_SAFE_INTEGER,
                low: Number.MAX_SAFE_INTEGER,
                close: clean_ws_data[0].price,
                time: newestwsdatatime,
                volume: 0
              })

              data = [ ...data, newdata ]
              let inds = indicators(14, 3, data)
              return { ...product, data, ws_data: clean_ws_data, srsi: inds.srsi, rsi: inds.rsi, cci: inds.cci }
            }
            // return product with new ws_data and new data
            return { ...product, data , ws_data: clean_ws_data }
          }
          // return product because we are not updating the prduct with this ID
          return product
        })
      }
    default:
      return state
  }
}
