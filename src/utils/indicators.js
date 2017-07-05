

export const indicators = (period = 14, signalPeriod = 3, data) => {

  let k =  signalPeriod
  let d = signalPeriod
  let rsiLength = period
  let stochLength = period
  let rsi = []
  let srsi = []
  if(data[0]){
    rsi = [ ...rsi, { time: data[0].time }]
    srsi = [ ...srsi, { time: data[0].time }]
  }

  for( let i=1; i < data.length; i++){
    let gain = 0
    let loss = 0
    let sumGains = 0
    let sumLosses = 0
    let close = data[i].close
    let time = data[i].time
    rsi = [ ...rsi, { time } ]
    srsi = [ ...srsi, { time } ]

    // RSI, Averageing is EMA
    if (close > data[i-1].close){
      gain = close - data[i-1].close
    } else if (close < data[i-1].close){
      loss = data[i-1].close - close
    }
    rsi[i] = { gain, loss }
    if ( i >= rsiLength ){
      //set initial average values
      if( i === rsiLength){
        //get sum of gains values in rsiLength
        for(let j=0; j <rsiLength; j++){
          sumGains += rsi[i-j].gain
          sumLosses += rsi[i-j].loss
        }
        let avgGain = sumGains / rsiLength
        let avgLoss = sumLosses / rsiLength
        rsi[i] = { ...rsi[i], avgGain, avgLoss, value: 100 - (100/(( avgGain / avgLoss + 1))) }
      } else {
        let lastAvgGain = rsi[i-1].avgGain
        let lastAvgLoss = rsi[i-1].avgLoss
        let currentGain = rsi[i].gain
        let currentLoss = rsi[i].loss
        let avgGain = ( lastAvgGain * (rsiLength - 1) + currentGain ) / rsiLength
        let avgLoss = ( lastAvgLoss * (rsiLength - 1) + currentLoss ) / rsiLength
        let rs = avgGain / avgLoss
        rsi[i] = { ...rsi[i], avgGain, avgLoss, value:  100 - (100/(rs + 1))}
      }

      // StochRSI
      if (i >= rsiLength + stochLength){
        let minRSI = rsi[i].value
        let maxRSI = minRSI
        // iterate through last 14 data to get min and max rsi
        for(let j=0;j<stochLength;j++){
          let newRSI = rsi[i-j].value
          minRSI = Math.min(newRSI, minRSI)
          maxRSI = Math.max(newRSI, maxRSI)
        }
        srsi[i] = { ...srsi[i], stoch: (rsi[i].value - minRSI) / (maxRSI - minRSI)}
      }

      if(i >= rsiLength + stochLength + k){
        let sumStoch = 0
        for(let j=0; j < k; j++){
          sumStoch += srsi[i].stoch
        }
        //console.log('')
        //console.log(srsi[i].stoch)
        srsi[i] = { ...srsi[i], k: sumStoch / k}

      }

      if(i >= rsiLength + stochLength + k + d){
        let sumK = 0
        for(let j=0; j < d; j++){
          sumK += srsi[i].k
        }
        //console.log(srsi[i].k)
        srsi[i] = { ...srsi[i], d: sumK / d}
        //console.log('srsi[i].d', srsi[i].d, sumK / d)
      }
    }

  }
  return { srsi, rsi }
}



// adding object to array, initialize with pt = close. pt means point, like as in data p
//cci = [ ...cci, { price: close } ]

// for CCI calc: get CCI
// if (i >= cciLength) {
//   //reset values for moving average and standard deviation
//   priceMovingAverage = 0
//   priceAverageDeviation = 0
//   // set moving average
//   if (i > cciLength - 1) {
//       // sum of last cciLength days closing price
//       // i > 13  -> i >=14 when this block executes
//       for(let j=0; j < cciLength; j++) {
//           // 14 - 0 -> 14 - 14 === 14 -> 0
//           priceMovingAverage += cci[i-j].price
//       }
//       // divide by length to get averaage
//       priceMovingAverage = priceMovingAverage/cciLength
//       // set average deviation
//       for(let j=0; j < cciLength; j++){
//         priceAverageDeviation += Math.abs(cci[i-j].price - priceMovingAverage)
//       }
//       priceAverageDeviation = priceAverageDeviation / cciLength
//       cci[i].value = (cci[i].price - priceMovingAverage)/(0.015 * priceAverageDeviation)
//   }
// }
