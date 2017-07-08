import axios from 'axios'
import crypto from 'crypto'
import moment from 'moment'

//axios.defaults.baseURL = 'https://api-public.sandbox.gdax.com'
axios.defaults.baseURL = 'https://api.gdax.com'

const authRequest = (uri, params, method, body, session) => {

  // let timestamp = Date.now() / 1000;
  // let requestPath = uri;
  // body = JSON.stringify(body);
  // let what = timestamp + method + requestPath + body ? body : '';
  // let secretKey = Buffer(secret, 'base64');
  // let hmac = crypto.createHmac('sha256', secretKey);
  // let sign = hmac.update(what).digest('base64');
  // let headers = {
  //   'CB-ACCESS-KEY': apiKey,
  //   'CB-ACCESS-SIGN': sign,
  //   'CB-ACCESS-TIMESTAMP': timestamp,
  //   'CB-ACCESS-PASSPHRASE': passphrase
  // }
  let headers = { 'CB-SESSION': session}
  let options = { method, headers,  url: uri + params, data: body}
  return axios(options)
}

export const getAccounts = (session) => {
  let uri ='/accounts'
  return authRequest(uri, '', 'get', '', session)
}

let handleError = (error) => {
  console.warn(error)
  return null;
}

export let serverTime = () => {
  let url = `/time`
  return axios.get(url).then(res => (
    res.data
  ))
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


export const getProducts = () => {
  let url = '/products'
  return axios.get(url).then(res => {
    return res.data
  }).catch(handleError)
}
