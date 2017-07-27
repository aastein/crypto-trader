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

const commodityChannelIndex = (data, params) => {
  const period = params.period;
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

  // TODO: enable this when its up on NPM
  // const cci = Indicators.CCI.calculate({
  //   open: data.map(d => (d.open)),
  //   high: data.map(d => (d.high)),
  //   low: data.map(d => (d.low)),
  //   close: data.map(d => (d.close)),
  //   ...params,
  // }).map(d => (
  //   { CCI: d }
  // ));
  // const offset = data.length - cci.length;
  // for (let i = 0; i < cci.length; i += 1) {
  //   cci[i].time = data[i + offset].time;
  // }
  // return { cci };
};

const simpleMovingAverage = (data, params) => {
  const sma = Indicators.SMA.calculate({
    ...params,
    values: data.map(d => (d.close)),
  }).map(d => (
    { SMA: d }
  ));
  for (let i = 0; i < sma.length; i += 1) {
    sma[i].time = data[(i + params.period) - 1].time;
  }
  return { sma };
};

const relativeStrengthIndex = (data, params) => {
  const rsi = Indicators.RSI.calculate({
    ...params,
    values: data.map(d => (d.close)),
  }).map(d => (
    { RSI: d }
  ));
  for (let i = 0; i < rsi.length; i += 1) {
    rsi[i].time = data[i + params.period].time;
  }
  return { rsi };
};

const exponentialMovingAverage = (data, params) => {
  const ema = Indicators.EMA.calculate({
    ...params,
    values: data.map(d => (d.close)),
  }).map(d => (
    { EMA: d }
  ));
  for (let i = 0; i < ema.length; i += 1) {
    ema[i].time = data[i + (params.period - 1)].time;
  }
  return { ema };
};

const weightedMovingAverage = (data, params) => {
  const wma = Indicators.WMA.calculate({
    values: data.map(d => (d.close)),
    ...params,
  }).map(d => (
    { WMA: d }
  ));
  for (let i = 0; i < wma.length; i += 1) {
    wma[i].time = data[i + (params.period - 1)].time;
  }
  return { wma };
};

const movingAverageConvergenceDivergence = (data, params) => {
  const macd = Indicators.MACD.calculate({
    values: data.map(d => (d.close)),
    ...params,
  }).map(d => (
    { ...d }
  ));
  for (let i = 0; i < macd.length; i += 1) {
    macd[i].time = data[i + (params.slowPeriod - 1)].time;
  }
  return { macd };
};

const bollingerBands = (data, params) => {
  const bb = Indicators.BollingerBands.calculate({
    values: data.map(d => (d.close)),
    ...params,
  }).map(d => (
    { ...d }
  ));
  for (let i = 0; i < bb.length; i += 1) {
    bb[i].time = data[i + (params.period - 1)].time;
  }
  return { bb };
};

const averageTrueRange = (data, params) => {
  const atr = Indicators.ATR.calculate({
    high: data.map(d => (d.high)),
    low: data.map(d => (d.low)),
    close: data.map(d => (d.close)),
    ...params,
  }).map(d => (
    { ATR: d }
  ));
  for (let i = 0; i < atr.length; i += 1) {
    atr[i].time = data[i + (params.period - 1)].time;
  }
  return { atr };
};

const wildersSmoothingAverage = (data, params) => {
  const wema = Indicators.WEMA.calculate({
    values: data.map(d => (d.close)),
    ...params,
  }).map(d => (
    { WEMA: d }
  ));
  const offset = data.length - wema.length;
  for (let i = 0; i < wema.length; i += 1) {
    wema[i].time = data[i + offset].time;
  }
  return { wema };
};

const rateOfChange = (data, params) => {
  const roc = Indicators.ROC.calculate({
    values: data.map(d => (d.close)),
    ...params,
  }).map(d => (
    { ROC: d }
  ));
  const offset = data.length - roc.length;
  for (let i = 0; i < roc.length; i += 1) {
    roc[i].time = data[i + offset].time;
  }
  return { roc };
};

const knowSureThing = (data, params) => {
  const kst = Indicators.KST.calculate({
    values: data.map(d => (d.close)),
    ...params,
  }).map(d => (
    { ...d }
  ));
  const offset = data.length - kst.length;
  for (let i = 0; i < kst.length; i += 1) {
    kst[i].time = data[i + offset].time;
  }
  return { kst };
};

const stochastic = (data, params) => {
  const stoch = Indicators.Stochastic.calculate({
    high: data.map(d => (d.high)),
    low: data.map(d => (d.low)),
    close: data.map(d => (d.close)),
    ...params,
  }).map(d => (
    { ...d }
  ));
  const offset = data.length - stoch.length;
  for (let i = 0; i < stoch.length; i += 1) {
    stoch[i].time = data[i + offset].time;
  }
  return { stoch };
};

const williamsR = (data, params) => {
  const wr = Indicators.WilliamsR.calculate({
    high: data.map(d => (d.high)),
    low: data.map(d => (d.low)),
    close: data.map(d => (d.close)),
    ...params,
  }).map(d => (
    { 'Wm%R': d }
  ));
  const offset = data.length - wr.length;
  for (let i = 0; i < wr.length; i += 1) {
    wr[i].time = data[i + offset].time;
  }
  return { wr };
};

const accumulationDistributionLine = (data) => {
  const adl = Indicators.ADL.calculate({
    high: data.map(d => (d.high)),
    low: data.map(d => (d.low)),
    close: data.map(d => (d.close)),
    volume: data.map(d => (d.volume)),
  }).map(d => (
    { ADL: d }
  ));
  const offset = data.length - adl.length;
  for (let i = 0; i < adl.length; i += 1) {
    adl[i].time = data[i + offset].time;
  }
  return { adl };
};

const onBalanceVolume = (data) => {
  const obv = Indicators.OBV.calculate({
    close: data.map(d => (d.close)),
    volume: data.map(d => (d.volume)),
  }).map(d => (
    { OBV: d }
  ));
  const offset = data.length - obv.length;
  for (let i = 0; i < obv.length; i += 1) {
    obv[i].time = data[i + offset].time;
  }
  return { obv };
};

const tripleExponentiallySmoothedAverage = (data, params) => {
  const trix = Indicators.TRIX.calculate({
    values: data.map(d => (d.close)),
    ...params,
  }).map(d => (
    { TRIX: d }
  ));
  const offset = data.length - trix.length;
  for (let i = 0; i < trix.length; i += 1) {
    trix[i].time = data[i + offset].time;
  }
  return { trix };
};

const averageDirectionalIndex = (data, params) => {
  const adx = Indicators.ADX.calculate({
    close: data.map(d => (d.close)),
    high: data.map(d => (d.high)),
    low: data.map(d => (d.low)),
    ...params,
  }).map(d => (
    { ADX: d }
  ));
  const offset = data.length - adx.length;
  for (let i = 0; i < adx.length; i += 1) {
    adx[i].time = data[i + offset].time;
  }
  return { adx };
};

const calculateIndicators = (indicators, data) => {
  let indicatorData = {};
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
          ...relativeStrengthIndex(data, indicators[i].params),
        };
        break;
      case 'cci':
        indicatorData = {
          ...indicatorData,
          ...commodityChannelIndex(data, indicators[i].params),
        };
        break;
      case 'sma':
        indicatorData = {
          ...indicatorData,
          ...simpleMovingAverage(data, indicators[i].params),
        };
        break;
      case 'ema':
        indicatorData = {
          ...indicatorData,
          ...exponentialMovingAverage(data, indicators[i].params),
        };
        break;
      case 'wma':
        indicatorData = {
          ...indicatorData,
          ...weightedMovingAverage(data, indicators[i].params),
        };
        break;
      case 'macd':
        indicatorData = {
          ...indicatorData,
          ...movingAverageConvergenceDivergence(data, indicators[i].params),
        };
        break;
      case 'bb':
        indicatorData = {
          ...indicatorData,
          ...bollingerBands(data, indicators[i].params),
        };
        break;
      case 'atr':
        indicatorData = {
          ...indicatorData,
          ...averageTrueRange(data, indicators[i].params),
        };
        break;
      case 'wema':
        indicatorData = {
          ...indicatorData,
          ...wildersSmoothingAverage(data, indicators[i].params),
        };
        break;
      case 'roc':
        indicatorData = {
          ...indicatorData,
          ...rateOfChange(data, indicators[i].params),
        };
        break;
      case 'kst':
        indicatorData = {
          ...indicatorData,
          ...knowSureThing(data, indicators[i].params),
        };
        break;
      case 'stoch':
        indicatorData = {
          ...indicatorData,
          ...stochastic(data, indicators[i].params),
        };
        break;
      case 'wr':
        indicatorData = {
          ...indicatorData,
          ...williamsR(data, indicators[i].params),
        };
        break;
      case 'adl':
        indicatorData = {
          ...indicatorData,
          ...accumulationDistributionLine(data),
        };
        break;
      case 'obv':
        indicatorData = {
          ...indicatorData,
          ...onBalanceVolume(data),
        };
        break;
      case 'trix':
        indicatorData = {
          ...indicatorData,
          ...tripleExponentiallySmoothedAverage(data, indicators[i].params),
        };
        break;
      case 'adx':
        indicatorData = {
          ...indicatorData,
          ...averageDirectionalIndex(data, indicators[i].params),
        };
        break;
      default:
        break;
    }
  }
  return indicatorData;
};

export default calculateIndicators;
