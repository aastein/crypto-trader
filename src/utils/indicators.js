export const indicators = (indicators, data) => {
  let indicatorData = {}
  for(const i of indicators){
    switch (i.id) {
      case 'srsi':
        indicatorData = { ...indicatorData, ...srsi(data, i.params.rsiPeriod, i.params.stochPeriod, i.params.kPeriod, i.params.dPeriod)}
        break;
      case 'cci':
        indicatorData = { ...indicatorData, ...cci(data, i.params.period)}
        break;
      default:
        break;
    }
  }
  return indicatorData
}

const srsi = (data, rsiPeriod, stochPeriod, kPeriod, dPeriod) => {

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
    rsi[i] = { ...rsi[i], gain, loss }
    if ( i >= rsiPeriod ){
      //set initial average values
      if( i === rsiPeriod){
        //get sum of gains values in rsiLength
        for(let j=0; j < rsiPeriod; j++){
          sumGains += rsi[i-j].gain
          sumLosses += rsi[i-j].loss
        }
        let avgGain = sumGains / rsiPeriod
        let avgLoss = sumLosses / rsiPeriod
        rsi[i] = { ...rsi[i], avgGain, avgLoss, value: 100 - (100/(( avgGain / avgLoss + 1))) }
      } else {
        let lastAvgGain = rsi[i-1].avgGain
        let lastAvgLoss = rsi[i-1].avgLoss
        let currentGain = rsi[i].gain
        let currentLoss = rsi[i].loss
        let avgGain = ( lastAvgGain * (rsiPeriod - 1) + currentGain ) / rsiPeriod
        let avgLoss = ( lastAvgLoss * (rsiPeriod - 1) + currentLoss ) / rsiPeriod
        let rs = avgGain / avgLoss
        rsi[i] = { ...rsi[i], avgGain, avgLoss, value:  100 - (100/(rs + 1))}
      }
      // StochRSI
      if (i >= rsiPeriod + stochPeriod){
        let minRSI = rsi[i].value
        let maxRSI = minRSI
        // iterate through last 14 data to get min and max rsi
        for(let j=0;j < stochPeriod;j++){
          let newRSI = rsi[i-j].value
          minRSI = Math.min(newRSI, minRSI)
          maxRSI = Math.max(newRSI, maxRSI)
        }
        srsi[i] = { ...srsi[i], stoch: (rsi[i].value - minRSI) / (maxRSI - minRSI)}
      }
      if(i >= rsiPeriod + stochPeriod + kPeriod){
        let sumStoch = 0
        for(let j=0; j < kPeriod; j++){
          sumStoch += srsi[i-j].stoch
        }
        srsi[i] = { ...srsi[i], k: sumStoch / kPeriod}
      }
      if(i >= rsiPeriod + stochPeriod + kPeriod + dPeriod){
        let sumK = 0
        for(let j=0; j < dPeriod; j++){
          sumK += srsi[i-j].k
        }
        srsi[i] = { ...srsi[i], d: sumK / dPeriod}
      }
    }
  }
  return { rsi, srsi }
}

const metaSrsi = data => {

  let periods = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144]
  let signalPeriod = 3

}

const cci = (data, period) => {

  let cci = []

  if(data[0]){
    cci = [ ...cci, { time: data[0].time }]
  }

  for( let i=1; i < data.length; i++){
    cci = [ ...cci, { price: data[i].close, time: data[i].time } ]
    if (i >= period) {
      //reset values for moving average and standard deviation
      let priceMovingAverage = 0
      let priceAverageDeviation = 0
      // set moving average
      if (i > period - 1) {
          // sum of last cciLength days closing price
          // i > 13  -> i >=14 when this block executes
          for(let j=0; j < period; j++) {
              // 14 - 0 -> 14 - 14 === 14 -> 0
              priceMovingAverage += cci[i-j].price
          }
          // divide by length to get averaage
          priceMovingAverage = priceMovingAverage/period
          // set average deviation
          for(let j=0; j < period; j++){
            priceAverageDeviation += Math.abs(cci[i-j].price - priceMovingAverage)
          }
          priceAverageDeviation = priceAverageDeviation / period
          cci[i].value = (cci[i].price - priceMovingAverage)/(0.015 * priceAverageDeviation)
      }
    }
  }
  return { cci }
}
