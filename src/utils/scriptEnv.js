import { orderBook, placeOrder } from './api'

let products
let profile
let log

const product = (id) => {
  return products.reduce((a, b) => (
    a = b.id === id ? b : a
  ), {})
}
                  //(buy, BTC-USD,   1000)
const limitOrder = (side, productId) => {

  orderBook(productId).then((ob) => {

    let product = products.reduce((a, b) => (
      a = b.id === productId ? b : a
    ), {})

    let baseCurrency = product.base_currency // BTC
    let quoteCurrency = product.quote_currency // USD
    let quoteIncrement = product.quote_increment // 0.01

    let account
    let price

    // set account to account which will be handling the trade
    // set price to best price +/- quote increment
    if(side === 'buy'){
      account = profile.accounts.reduce((a, b) => (
        b.currency === quoteCurrency ? b : a
      ), {})
      price = parseFloat(ob.bid) + parseFloat(quoteIncrement)
    } else if(side === 'sell'){
      account = profile.accounts.reduce((a, b) => (
        b.currency === baseCurrency ? b : a
      ), {})
      price = parseFloat(ob.ask) - parseFloat(quoteIncrement)
    }

    let availableBalance = account.available

    // all in all out trade
    let size = availableBalance

    if(profile.live){
      placeOrder('limit', side, productId, price, size, profile.session, log).then(res => {
        return res.data
      }).catch( err => (err))
    } else {
      log('Turn on live mode to execute orders.')
    }
  })
}

export const run = (script, prods, prof, appendLog, updateAccounts) => {

  // set global variables
  products = prods
  profile = prof
  log = appendLog

  try {
    // define variables avalable in the script
    let LTC_EUR = product('LTC-EUR')
    let LTC_BTC = product('LTC-BTC')
    let BTC_GBP = product('BTC-GBP')
    let BTC_EUR = product('BTC-EUR')
    let ETH_EUR = product('ETH-EUR')
    let ETH_BTC = product('ETH-BTC')
    let LTC_USD = product('LTC-USD')
    let BTC_USD = product('BTC-USD')
    let ETH_USD = product('ETH-USD')

    let output = eval(script)
    if(output){
      appendLog('Ran script: ' + output)
    } else {
      appendLog('Ran script')
    }
    updateAccounts()
  } catch(err) {
    appendLog('Script encountered error: ' + err)
  }
}
