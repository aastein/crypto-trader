import axios from 'axios'
import crypto from 'crypto'

axios.defaults.baseURL = 'https://api-public.sandbox.gdax.com'
//axios.defaults.baseURL = 'https://api.gdax.com'

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

let isFetching = false

let handleError = (error) => {
  console.warn(error)
  return null;
}

let handleGetHistoricalDataError = callBack => {
  isFetching = false
  setTimeout(() => callBack(), 350);
  return null;
}

export let getHistorialData = (product, startDate, endDate, granularity) => {
  granularity = Math.floor(granularity)
  if (true){
    isFetching = true
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

export const tryGetHistoricalData = (product, start, end, granularity = 1) => {
  let rateConstant
  if(product.includes('LTC')){
    rateConstant = 400000
  } else if (product.includes('BTC')){
    rateConstant = 350000
  } else if (product.includes('ETH')){
    rateConstant = 350000
  }
  let epochDiff = new Date(end).getTime() - new Date(start).getTime()
  granularity = Math.max(( epochDiff / rateConstant ), granularity)
  let nextGranularity = granularity === 1 ? 2 : granularity * 1.1
  return axios.all(
    [getHistorialData(product, start, end, granularity)]
  ).then( data => {
    isFetching = false
    data = data.length ? data[0] : []
    return data
  }).catch(() => handleGetHistoricalDataError(() => tryGetHistoricalData(product, start, end, nextGranularity)))
}


export const getProducts = () => {
  let url = '/products'
  return axios.get(url).then(res => {
    return res.data
  }).catch(handleError)
}
