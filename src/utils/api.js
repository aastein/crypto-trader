import axios from 'axios'

/* Epoch to ISO
    Price data comes in epoch time, but requests must be made with ISO format
    var date = new Date();
    date.toISOString();

    var myDate = new Date("2012-02-10T13:19:11+0000");
    var result = myDate.getTime();
*/

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
  if (!isFetching){
    isFetching = true
    let url = `https://api.gdax.com/products/${product}/candles?start=${startDate}&end=${endDate}&granularity=${granularity}`
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
    rateConstant = 267879
  } else if (product.includes('BTC')){
    rateConstant = 350000
  } else if (product.includes('ETH')){
    rateConstant = 1
  }
  let epochDiff = new Date(end).getTime() - new Date(start).getTime()
  granularity = Math.max(( epochDiff / rateConstant ), granularity)
  let nextGranularity = granularity === 1 ? 2 : granularity * 1.1
  return axios.all(
    [getHistorialData(product, start, end, granularity)]
  ).then( data => {
    isFetching = false
    data = !data[0] ? [] : data[0].sort((a, b) => {
        if(a.time < b.time) return -1;
        if(a.time > b.time) return 1;
        return 0;
      })
    return data
  }).catch(() => handleGetHistoricalDataError(() => tryGetHistoricalData(product, start, end, nextGranularity)))
}


export const getProducts = () => {
  let url = 'https://api.gdax.com/products'
  return axios.get(url).then(res => {
    return res.data
  }).catch(handleError)
}
