let products

let product = (id) => {
  return products.reduce((a, b) => (
    a = b.id === id ? b : a
  ), {})
}

//mmnt.unix(products[0].data[0].time / 1000 ).format('YYYY-MM-DD')
// LTC_EUR(1496160000000)
export const run = (script, p, appendLog) => {
  // set global variable
  products = p
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
    appendLog('Script output: ' + output)
  } catch(err) {
    appendLog('Script encountered error: ' + err)
  }
}
