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
        srsi[i] = { ...srsi[i], k: sumStoch / kPeriod };
      }
      if (i >= rsiPeriod + stochPeriod + kPeriod + dPeriod) {
        let sumK = 0;
        for (let j = 0; j < dPeriod; j += 1) {
          sumK += srsi[i - j].k;
        }
        srsi[i] = { ...srsi[i], d: sumK / dPeriod };
      }
    }
  }
  return { rsi, srsi };
};

// TODO: eliminate unnessary looping
const metasrsi = (data, rsiPeriod, stochPeriod, kPeriod, dPeriod) => {
  const periods = [8, 13, 21, 34, 55];
  let allDerivatives = [];
  const dataLength = data.length;

  for (let i = 0; i < periods.length; i += 1) {
    const p = periods[i];
    const s = stochRSI(data, p, p, kPeriod, dPeriod).srsi;
    const startPoint = p + p + kPeriod + dPeriod;
    let derivatives = [];

    for (let j = 0; j < dataLength; j += 1) {
      let dk = 0;
      let dd = 0;
      const time = s[j].time;

      if (j > startPoint) {
        if (j === startPoint && j !== dataLength - 1) {
          dk = s[j + 1].k - s[startPoint].k;
          dd = s[j + 1].d - s[startPoint].d;
        } else if (j === s.length - 1) {
          dk = s[j].k - s[j - 1].k;
          dd = s[j].d - s[j - 1].d;
        } else {
          dk = s[j].k - s[j - 1].k;
          dd = s[j].d - s[j - 1].d;
        }
      }
      derivatives = [...derivatives, { time, dk, dd }];
    }
    allDerivatives = [...allDerivatives, derivatives];
  }

  const numPeriods = allDerivatives.length;

  const sumDerivatives = allDerivatives[0];
  for (let i = 1; i < numPeriods; i += 1) {
    for (let j = 0; j < dataLength; j += 1) {
      sumDerivatives[j].dk += allDerivatives[i][j].dk;
      sumDerivatives[j].dd += allDerivatives[i][j].dd;
    }
  }

  let meta = [{ time: sumDerivatives[0].time, k: 0.5, d: 0.5 }];
  for (let i = 1; i < dataLength; i += 1) {
    meta = [...meta, {
      time: sumDerivatives[i].time,
      k: meta[i - 1].k + (sumDerivatives[i].dk / numPeriods),
      d: meta[i - 1].d + (sumDerivatives[i].dd / numPeriods),
    }];
  }

  return { metasrsi: meta };
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
        cci[i].value = (cci[i].price - priceMovingAverage) / (0.015 * priceAverageDeviation);
      }
    }
  }
  return { cci };
};

const calculateIndicators = (inds, data) => {
  let indicatorData = {};
  const indicators = inds.filter(i => (
    i.active
  ));
  for (let i = 0; i < indicators.length; i += 1) {
    switch (indicators[i].id) {
      case 'SRSI':
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
      case 'Meta RSI':
        indicatorData = {
          ...indicatorData,
          ...metasrsi(
            data,
            indicators[i].params.rsiPeriod,
            indicators[i].params.stochPeriod,
            indicators[i].params.kPeriod,
            indicators[i].params.dPeriod,
          ),
        };
        break;
      case 'CCI':
        indicatorData = {
          ...indicatorData,
          ...commodityChannelIndex(data, indicators[i].params.period),
        };
        break;
      default:
        break;
    }
  }
  // console.log(indicatorData)
  return indicatorData;
};

export default calculateIndicators;
