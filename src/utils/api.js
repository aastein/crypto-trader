import axios from 'axios'

/* Epoch to ISO
    Price data comes in epoch time, but requests must be made with ISO format
    var date = new Date();
    date.toISOString();

    var myDate = new Date("2012-02-10T13:19:11+0000");
    var result = myDate.getTime();
*/

let isFetching = false

let handleError = callBack => {
  isFetching = false
  setTimeout(() => callBack(), 350);
  return null;
}

export let getHistorialData = (product, start, end, granularity) => {
  granularity = Math.floor(granularity)
  if (!isFetching){
    isFetching = true
    let url = `https://api.gdax.com/products/${product}/candles?start=${start}&end=${end}&granularity=${granularity}`
    return axios.get(url).then(res => (
      res.data.map(d => (
        {
          time : d[0],
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

export let tryGetHistoricalData = (product, start, end, granularity = 1) => {
  let rateConstantBTC = 350000
  let epochDiff = new Date(end).getTime() - new Date(start).getTime()
  granularity = granularity <= epochDiff / rateConstantBTC ? epochDiff / rateConstantBTC : granularity
  let nextGranularity = granularity === 1 ? 2 : granularity * 1.1
  return axios.all(
    [getHistorialData(product, start, end, granularity)]
  ).then( data => {
    isFetching = false
    return data
  }).catch(() => handleError(() => tryGetHistoricalData(product, start, end, nextGranularity)))
}
