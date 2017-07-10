import axios from 'axios'
import moment from 'moment'

//axios.defaults.baseURL = 'https://api-public.sandbox.gdax.com'
axios.defaults.baseURL = 'https://api.gdax.com'

const handleError = (error) => {
  console.warn(error)
  return null;
}

const authRequest = (uri, params, method, body, session) => {
  let headers = { 'CB-SESSION': session}
  let options = { method, headers,  url: uri + params, data: body}
  return axios(options)
}

export let serverTime = () => {
  let url = '/time'
  return axios.get(url).then(res => (
    res.data
  ))
}

/*
{
  "sequence":3528829167,
  "bids":[ [ "2556.3","0.02",2 ] ], price, size, num-orders
  "asks":[ [ "2556.31","2.55276193",3 ] ] price, size, num-orders
}
*/
export const orderBook = (productId) => {
  let url = `/products/${productId}/book`
  return axios.get(url).then(res => (
    {
      bid: res.data.bids[0][0],
      ask: res.data.asks[0][0]
    }
  ))
}

export const setOrderBook = (productId, updateOrderBook) => {
  orderBook(productId).then(ob => {
    updateOrderBook(productId, ob)
  })
}

export const getAccounts = (session) => {
  let uri ='/accounts'
  return authRequest(uri, '', 'get', '', session).then(res => {
    return res.data
  }).catch( err => {alert('Session ID invalid.')})
}

export const fetchProductData = (id, range, granularity, setProductData) => {
  serverTime().then( time => {
    tryGetHistoricalData(id, time, range, granularity).then( data => {
      setProductData(id, data)
    }).catch((err) => {alert('Granularity too small.')})
  })
}

export const getProducts = () => {
  let url = '/products'
  return axios.get(url).then(res => {
    return res.data
  }).catch(handleError)
}

export let getHistorialData = (product, startDate, endDate, granularity) => {
  //console.log('startDate', startDate, 'endDate', endDate)
  granularity = Math.ceil(granularity)
  if (true){
    let url = `/products/${product}/candles?start=${startDate}&end=${endDate}&granularity=${granularity}`
    return axios.get(url).then(res => (
      res.data.map(d => (
        {
          time : d[0] * 1000,
          low: d[1],
          high: d[2],
          open: d[3],
          close: d[4],
          volume: d[5]
        }
      ))
    ))
  }
}

// GDAX doesnt like handling large requests to if the requested range is too big to be
// served in a single response, split up into multiple requests
// GDAX also has a burst request limit so it is important to not initialize the app a rage so wide
// that it needs to split the requests
// granularity == 300000 = 30s => I want a data point ever 30s
export const tryGetHistoricalData = (productId, time, range, desiredGranularity) => {

    //console.log('time', time)
    let rateConstant
    let requests = []
    let epochEnd = time.epoch
    let epochDiff = range * 60 // ( minutes * (seconds / minute ) )
    let maxConcurrentRequests = 10

    if(productId.includes('LTC')){
      rateConstant = 400
    } else if (productId.includes('BTC')){
      rateConstant = 350
    } else if (productId.includes('ETH')){
      rateConstant = 350
    }

    // ms * (ms / trade)^-1 => trade?
    //  console.log(epochDiff) // minutes
    let minGranularityIfSingleRequest = Math.ceil(epochDiff / rateConstant)
    let numRequsts = Math.ceil(minGranularityIfSingleRequest / desiredGranularity)
    let epochStep = Math.ceil(epochDiff / numRequsts)

    if(numRequsts <= maxConcurrentRequests){
      for(let i = 0; i < numRequsts; i++){
        let nStart = moment.unix(epochEnd - epochStep - (epochStep * i)).toISOString()
        let nEnd = moment.unix(epochEnd - (epochStep * i)).toISOString()
        let request = getHistorialData(productId, nStart, nEnd, desiredGranularity)
        requests = [ ...requests, request]
      }

      return axios.all(
        requests
      ).then( axios.spread( ( ...data ) => {
        data = data.reduce( (a, b) => (
          a = [ ...a, ...b ]
        ), [])
        return { epochEnd, data }
      })).catch(handleError)
    }
    return new Promise((resolve, reject) => {
      return reject('Ganularity too small!')
    })
}

/*
{
  "id": "d0c5340b-6d6c-49d9-b567-48c4bfca13d2",
  "price": "0.10000000",
  "size": "0.01000000",
  "product_id": "BTC-USD",
  "side": "buy",
  "stp": "dc",
  "type": "limit",
  "time_in_force": "GTC",
  "post_only": false,
  "created_at": "2016-12-08T20:02:28.53864Z",
  "fill_fees": "0.0000000000000000",
  "filled_size": "0.00000000",
  "executed_value": "0.0000000000000000",
  "status": "pending",
  "settled": false
}
*/
export const placeOrder = (type, side, productId, price, size, session, log) => {
  //console.log('size', size)
  let uri ='/orders'
  let body = {
    type: type,
    side: side,
    product_id: productId,
    price: price,
    size: size,
    time_in_force: 'GTT',
    cancel_after: 'min'
  }

  //uri, params, method, body, session
  return authRequest(uri, '', 'post', body, session).then(res => {
    res = res.data
    log(`Sent ${res.side} ${type} order of ${res.product_id}. Price ${res.price}, Size ${res.size}`)
  }).catch( error => {
    if (error.response) {
      log(`Order Error: ${error.response.data.message}`);
      // replace failed buy order by lowering the price
      if(side === 'buy' && error.response.data.messag.contains('Insufficient')){
        placeOrder(type, side, productId, (price - 0.01), size, session, log)
      }
    } else {
      log('Error', error);
    }
  })
}
