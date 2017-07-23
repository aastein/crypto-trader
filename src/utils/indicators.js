import * as Indicators from 'technicalindicators';

const stochRSI = (data, rsiPeriod, stochPeriod, kPeriod, dPeriod) => {
  let rsi = [];
  let srsi = [];

  if (data[0]) {
    rsi = [...rsi, { time: data[0].time }];
    srsi = [...srsi, { time: data[0].time }];
  }

  for (let i = 1; i < data.length; i += 1) {
    let gain = 0;
    let loss = 0;
    let sumGains = 0;
    let sumLosses = 0;
    const close = data[i].close;
    const time = data[i].time;
    rsi = [...rsi, { time }];
    srsi = [...srsi, { time }];
    // RSI, Averageing is EMA
    if (close > data[i - 1].close) {
      gain = close - data[i - 1].close;
    } else if (close < data[i - 1].close) {
      loss = data[i - 1].close - close;
    }
    rsi[i] = { ...rsi[i], gain, loss };
    if (i >= rsiPeriod) {
      // set initial average values
      if (i === rsiPeriod) {
        // get sum of gains values in rsiLength
        for (let j = 0; j < rsiPeriod; j += 1) {
          sumGains += rsi[i - j].gain;
          sumLosses += rsi[i - j].loss;
        }
        const avgGain = sumGains / rsiPeriod;
        const avgLoss = sumLosses / rsiPeriod;
        rsi[i] = { ...rsi[i], avgGain, avgLoss, value: 100 - (100 / (((avgGain / avgLoss) + 1))) };
      } else {
        const lastAvgGain = rsi[i - 1].avgGain;
        const lastAvgLoss = rsi[i - 1].avgLoss;
        const currentGain = rsi[i].gain;
        const currentLoss = rsi[i].loss;
        const avgGain = ((lastAvgGain * (rsiPeriod - 1)) + currentGain) / rsiPeriod;
        const avgLoss = ((lastAvgLoss * (rsiPeriod - 1)) + currentLoss) / rsiPeriod;
        const rs = avgGain / avgLoss;
        rsi[i] = { ...rsi[i], avgGain, avgLoss, value: 100 - (100 / (rs + 1)) };
      }
      // StochRSI
      if (i >= rsiPeriod + stochPeriod) {
        let minRSI = rsi[i].value;
        let maxRSI = minRSI;
        // iterate through last 14 data to get min and max rsi
        for (let j = 0; j < stochPeriod; j += 1) {
          const newRSI = rsi[i - j].value;
          minRSI = Math.min(newRSI, minRSI);
          maxRSI = Math.max(newRSI, maxRSI);
        }
        srsi[i] = { ...srsi[i], stoch: (rsi[i].value - minRSI) / (maxRSI - minRSI) };
      }
      if (i >= rsiPeriod + stochPeriod + kPeriod) {
        let sumStoch = 0;
        for (let j = 0; j < kPeriod; j += 1) {
          sumStoch += srsi[i - j].stoch;
        }
        srsi[i] = { ...srsi[i], K: sumStoch / kPeriod };
      }
      if (i >= rsiPeriod + stochPeriod + kPeriod + dPeriod) {
        let sumK = 0;
        for (let j = 0; j < dPeriod; j += 1) {
          sumK += srsi[i - j].K;
        }
        srsi[i] = { ...srsi[i], D: sumK / dPeriod };
      }
    }
  }
  return { srsi };
};

const commodityChannelIndex = (data, period) => {
  let cci = [];

  if (data[0]) {
    cci = [...cci, { time: data[0].time }];
  }

  for (let i = 1; i < data.length; i += 1) {
    cci = [...cci, { price: data[i].close, time: data[i].time }];
    if (i >= period) {
      // reset values for moving average and standard deviation
      let priceMovingAverage = 0;
      let priceAverageDeviation = 0;
      // set moving average
      if (i > period - 1) {
          // sum of last cciLength days closing price
          // i > 13  -> i >=14 when this block executes
        for (let j = 0; j < period; j += 1) {
              // 14 - 0 -> 14 - 14 === 14 -> 0
          priceMovingAverage += cci[i - j].price;
        }
          // divide by length to get averaage
        priceMovingAverage /= period;
          // set average deviation
        for (let j = 0; j < period; j += 1) {
          priceAverageDeviation += Math.abs(cci[i - j].price - priceMovingAverage);
        }
        priceAverageDeviation /= period;
        cci[i].CCI = (cci[i].price - priceMovingAverage) / (0.015 * priceAverageDeviation);
      }
    }
  }
  return { cci };
};

const simpleMovingAverage = (data, period) => {
  const sma = Indicators.SMA.calculate({
    period,
    values: data.map(d => (d.close)),
  }).map(d => (
    { SMA: d }
  ));
  for (let i = 0; i < sma.length; i += 1) {
    sma[i].time = data[(i + period) - 1].time;
  }
  return { sma };
};

const relativeStrengthIndex = (data, period) => {
  const rsi = Indicators.RSI.calculate({
    period,
    values: data.map(d => (d.close)),
  }).map(d => (
    { RSI: d }
  ));
  for (let i = 0; i < rsi.length; i += 1) {
    rsi[i].time = data[i + period].time;
  }
  return { rsi };
};

const calculateIndicators = (inds, data) => {
  let indicatorData = {};
  const indicators = inds.filter(i => (
    i.active
  ));
  for (let i = 0; i < indicators.length; i += 1) {
    switch (indicators[i].id) {
      case 'srsi':
        indicatorData = {
          ...indicatorData,
          ...stochRSI(
            data,
            indicators[i].params.rsiPeriod,
            indicators[i].params.stochPeriod,
            indicators[i].params.kPeriod,
            indicators[i].params.dPeriod,
          ),
        };
        break;
      case 'rsi':
        indicatorData = {
          ...indicatorData,
          ...relativeStrengthIndex(data, indicators[i].params.period),
        };
        break;
      case 'cci':
        indicatorData = {
          ...indicatorData,
          ...commodityChannelIndex(data, indicators[i].params.period),
        };
        break;
      case 'sma':
        indicatorData = {
          ...indicatorData,
          ...simpleMovingAverage(data, indicators[i].params.period),
        };
        break;
      default:
        break;
    }
  }
  return indicatorData;
};

export default calculateIndicators;
