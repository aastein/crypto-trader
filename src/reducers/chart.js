import * as actionType from '../actions/actionTypes'
import moment from 'moment'

let INITAL_CHART_STATE = {
  startDate: moment().subtract(1, "days").toISOString(),
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
      // add new ws_data to product
      // after ws_data is sorted, remove all that are 5min(300000ms) after newest ws_data
      // if newst ws_data is 1min + last data.time, calculate ohlc and add to data with time = latest ws_time
      console.log('')

      const DATA_GRANULARITY = 300000 / 5 / 2
      return {
        ...state,

        products: state.products.map( product => {

          if(product.id === action.id){

            // get procut data
            let data = product.data ? [ ...product.data ] : []

            // get time of newest product data
            let newestdatatime =  data[data.length - 1] && data[data.length - 1].time ? data[data.length - 1].time : null

            // get all ws_data for product
            let ws_data = product.ws_data ? [...product.ws_data, ...action.ws_data] : action.ws_data

            // if ws_data is not array, set it to empty array
            ws_data = ws_data && ws_data.length ? ws_data : []

            // get time of oldest ws_data
            let newestwsdatatime = ws_data[ws_data.length - 1].time ? ws_data[ws_data.length - 1].time : null
            let oldestwsdatatime = ws_data[0].time ? ws_data[0].time : null


            // init date list for filtering
            let times = []

            // filter out duplicate times
            ws_data = ws_data.filter( d => {

              let isDupe = times.indexOf(d.time) > 0

              times.push(d.time)

              return !isDupe

            // sort by time, newest data on top
            }).sort((a, b) => {
                if(a.time < b.time) return -1;
                if(a.time > b.time) return 1;
                return 0;
            })
            .filter(d => {
              if(oldestwsdatatime){

                // filter out data older than 5 minutes
                if(action.id === 'BTC-USD'){
                  console.log(action.id,'filtering', newestwsdatatime, '-', d.time, '<', DATA_GRANULARITY, (newestwsdatatime - d.time < DATA_GRANULARITY))
                }

                return (newestwsdatatime - d.time < DATA_GRANULARITY)
              }
              return true
            })

            // if newist data time is 300000ms or greater behind oldest ws_data
            // get ohlc for ws_data and add to data array

            if(action.id === 'BTC-USD'){
              console.log(action.id, 'oldestwsdatatime', oldestwsdatatime)
              console.log(action.id, 'newestwsdatatime', newestwsdatatime)
              console.log(action.id, 'newestdatatime', newestdatatime )
              console.log(action.id, 'diff', (newestwsdatatime - newestdatatime) / 1000, 's' )
              console.log('gran', DATA_GRANULARITY/1000, 's')
            }

            if(oldestwsdatatime && newestdatatime && (newestwsdatatime - newestdatatime >= DATA_GRANULARITY)){

              let newdata = [ ...ws_data ]
              newdata = newdata.reduce((ohlc, d) => {
                return {
                  ...ohlc,
                  high: d.price > ohlc.high ? d.price : ohlc.high,
                  low: d.price < ohlc.low ? d.price : ohlc.low,
                  volume: d.size + ohlc.volume
                }
              }, {
                open: ws_data[ws_data.length - 1].price,
                high: Number.MIN_SAFE_INTEGER,
                low: Number.MAX_SAFE_INTEGER,
                close: ws_data[0].price,
                time: newestwsdatatime,
                volume: 0
              })

              data = [ ...data, newdata ]
            }


            // return product with new ws_data and new data
            return { ...product, ws_data, data}
          }
          // return product because we are not updating the prduct with this ID
          return product
        })

      }
    default:
      return state
  }
}
