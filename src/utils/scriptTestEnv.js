let products
let p
let orderHist = []
/*
if(p.srsi[now - 1].k < 0.2 && p.srsi[now].k >= 0.2){
  buy()
} else if (p.srsi[now - 1].k > 0.8 && p.srsi[now].k <= 0.8){
  sell()
}
*/
const round = (value, decimals) => {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

export const test = (script, prods, appendLog) => {

  products = prods
  p = products.reduce((a, b) => (
    b.active ? b : a
  ), {})

  for(let i = 1; i < p.data.length - 1; i++){
    let now = i
    try {

      let buy = () => {
        if (orderHist.length === 0) {
          orderHist = [ ...orderHist, {'balance': (-1) * p.data[ i + 1].open }]
        } else if (orderHist[orderHist.length - 1].balance > 0){
            orderHist = [ ...orderHist, {'balance': (-1) * p.data[ i + 1].open }]
        }
      }

      let sell = () => {
        if(orderHist[orderHist.length - 1].balance){
          if(orderHist[orderHist.length - 1].balance < 0){
            orderHist = [ ...orderHist, {'balance': p.data[ i + 1].open }]
          }
        }
      }

      eval(script)
    } catch(err) {
      appendLog('Script encountered error: ' + err)
    }
  }

  let losses = []
  let gains = []
  let numTrades = orderHist.length

  for(let i = 1; i < numTrades; i++){
    let thisTrade = orderHist[i].balance
    let lastTrade = orderHist[i - 1].balance
    let tradeDiff = thisTrade + lastTrade

    // console.log('tradeDiff', tradeDiff)
    // console.log('thisTrade', thisTrade)
    // console.log('lastTrade', lastTrade)
    // for every sell
    if (thisTrade > 0){
      if(tradeDiff > 0){ // gain
        gains = [ ...gains, tradeDiff]
      } else if (tradeDiff < 0){ // loss
        losses = [ ...losses, tradeDiff]
      }
    }
  }

  //console.log('gains', gains)
  //console.log('losses', losses)

  let avgLoss = round(losses.reduce((a, b) => ( a + b ), 0) / losses.length, 2)
  let avgGain = round(gains.reduce((a, b) => ( a + b ), 0) / losses.length, 2)
  let diff = round(avgGain + avgLoss, 2)
  let total = round(losses.reduce((a, b) => ( a + b ), 0) + gains.reduce((a, b) => ( a + b ), 0), 2)

  appendLog(`Avg. gain: ${avgGain} Avg. loss: ${avgLoss} Diff: ${diff} Total: ${total}`)
}
