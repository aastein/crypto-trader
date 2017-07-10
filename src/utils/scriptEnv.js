import { orderBook, placeOrder } from './api'

let products
let profile
let log
let p

const round = (value, decimals) => {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

const floor = (value, decimals) => {
  return Number(Math.floor(value+'e'+decimals)+'e-'+decimals);
}

const limitOrder = (side, productId) => {
  orderBook(productId).then((ob) => {
    let product = products.reduce((a, b) => (
      a = b.id === productId ? b : a
    ), {})
    let baseCurrency = product.base_currency // BTC
    //let baseIncrement = product.base_min_size // 0.01
    let quoteCurrency = product.quote_currency // USD
    let quoteIncrement = product.quote_increment // 0.01
    let quoteAccount = profile.accounts.reduce((a, b) => (
      b.currency === quoteCurrency ? b : a
    ), {})
    let baseAccount = profile.accounts.reduce((a, b) => (
      b.currency === baseCurrency ? b : a
    ), {})
    let price
    let size
    // set account to account which will be handling the trade
    // set price to best price +/- quote increment
    if(side === 'buy'){
      price = round(Number(ob.bid), 2)
      size = floor(quoteAccount.available / price, 2)
    } else if(side === 'sell'){
      price = round(Number(ob.ask) - Number(quoteIncrement), 2)
      size = baseAccount.available
    }
    if(profile.live){
      if(size > 0){
        placeOrder('limit', side, productId, price, size, profile.session, log).then(res => {
          return res.data
        }).catch( err => (err))
      }
    } else {
      log('Turn on live mode to execute orders.')
    }
  })
}

const buy = () => {
  limitOrder('buy', p.id)
}

const sell = () => {
  limitOrder('sell', p.id)
}

export const run = (script, prods, prof, appendLog, updateAccounts) => {

  // set global variables
  products = prods
  profile = prof
  log = appendLog
  p = products.reduce((a, b) =>(
    b.active ? b : a
  ), {})

  try {
    // define variables avalable in the script
    let now = p.data ? p.data.length - 1 : 0
    eval(script)
  } catch(err) {
    appendLog('Script encountered error: ' + err)
  }
}
