import moment from 'moment'

let products

let value = (productId, time) => {
  return products.filter(product => {
    return product.id === productId
  })[0].data.reduce((a, b) => {
    let aDiff = Math.abs(a.time - time)
    let bDiff = Math.abs(b.time - time)
    if(aDiff > bDiff){
       return b
    }
    return a
  }, {time: -1})
}

let LTC_EUR = (time) => (
  value('LTC-EUR', time)
)

let LTC_BTC = (time) => (
  value('LTC-BTC', time)
)

let BTC_GBP = (time) => (
  value('BTC-GBP', time)
)

let BTC_EUR = (time) => (
  value('BTC-EUR', time)
)

let ETH_EUR = (time) => (
  value('ETH-EUR', time)
)

let ETH_BTC = (time) => (
  value('ETH-BTC', time)
)

let LTC_USD = (time) => (
  value('LTC-USD', time)
)

let BTC_USD = (time) => (
  value('BTC-USD', time)
)

let ETH_USD = (time) => (
  value('ETH-USD', time)
)

//mmnt.unix(products[0].data[0].time / 1000 ).format('YYYY-MM-DD')
// LTC_EUR(1496160000000)
export const run = (script, p) => {
  products = p
  try {
    let mmnt = moment
    console.log(eval(script))
  } catch(err) {
    console.log(err)
  }
}
