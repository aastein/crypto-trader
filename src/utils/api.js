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

export let getHistorialData = (product, startDate, endDate, granularity) => {
  granularity = Math.floor(granularity)
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

// granularity == 300000 = 30s => I want a data point ever 30s
export const tryGetHistoricalData = (productId, start, end, desiredGranularity) => {

  console.log('')
  console.log('desiredGranularity', desiredGranularity)
  // convert desired granularity to s from ms
  // granularity = 3600 => 1hr
  desiredGranularity = desiredGranularity / 1000

  let rateConstant

  if(productId.includes('LTC')){
    rateConstant = 400000
  } else if (productId.includes('BTC')){
    rateConstant = 350000
  } else if (productId.includes('ETH')){
    rateConstant = 350000
  }

  let epochStart = new Date(start).getTime()
  let epochDiff = new Date(end).getTime() - epochStart

  // ms * (ms / trade)^-1 => trade?
  let maxGranularityIfSingleRequest = Math.ceil(epochDiff / rateConstant)
  //console.log('maxGranularityIfSingleRequest', maxGranularityIfSingleRequest)
  let numRequsts = Math.ceil(maxGranularityIfSingleRequest / desiredGranularity)
  //console.log('numRequsts', numRequsts)
  let epochStep = Math.ceil(epochDiff / numRequsts)


  let requests = []

  //console.log(numRequsts);
  console.log('epochStart', epochStart)
  console.log('epochStep', epochStep)

  for (let i = 0; i < numRequsts; i++) {

    let nStart = moment(epochStart + (epochStep * i)).toISOString()
    let nEnd = moment(epochStart + epochStep + (epochStep * i)).toISOString()

    let request = getHistorialData(productId, nStart, nEnd, desiredGranularity)
    requests = [ ...requests, request]
  }

  //console.log(requests)

  return axios.all(
    requests
  ).then( data => {
  //  console.log(data)
    data = data.length ? data[0] : []
    return data
  }).catch(handleError)
}

export const getProducts = () => {
  let url = '/products'
  return axios.get(url).then(res => {
    return res.data
  }).catch(handleError)
}
