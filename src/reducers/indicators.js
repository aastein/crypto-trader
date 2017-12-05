import * as actionType from '../actions/actionTypes';

const INIT_INDICATORS_STATE = [
  {
    name: 'Stoch RSI',
    id: 'srsi',
    params: {
      rsiPeriod: 14,
      stochPeriod: 14,
      kPeriod: 3,
      dPeriod: 3,
    },
    chartMin: 0,
    chartMax: 1,
    axisLines: [0.8, 0.2],
    renderOnMain: false,
    valueIds: ['K', 'D'],
    active: false,
  },
  {
    name: 'CCI',
    id: 'cci',
    params: {
      period: 20,
    },
    chartMin: -400,
    chartMax: 400,
    axisLines: [100, -100],
    renderOnMain: false,
    valueIds: ['CCI'],
    active: false,
  },
  {
    name: 'RSI',
    id: 'RSI',
    params: {
      period: 14,
    },
    chartMin: 0,
    chartMax: 100,
    axisLines: [70, 30],
    renderOnMain: false,
    valueIds: ['RSI'],
    active: false,
  },
  {
    name: 'SMA',
    id: 'SMA',
    params: {
      period: 8,
    },
    renderOnMain: true,
    valueIds: ['SMA'],
    active: false,
  },
  {
    name: 'EMA',
    id: 'EMA',
    params: {
      period: 8,
    },
    renderOnMain: true,
    valueIds: ['EMA'],
    active: false,
  },
  {
    name: 'WMA',
    id: 'WMA',
    params: {
      period: 8,
    },
    renderOnMain: true,
    valueIds: ['WMA'],
    active: false,
  },
  {
    name: 'MACD',
    id: 'MACD',
    params: {
      fastPeriod: 5,
      slowPeriod: 8,
      signalPeriod: 3,
      SimpleMAOscillator: false,
      SimpleMASignal: false,
    },
    renderOnMain: false,
    valueIds: [
      'MACD',
      'histogram',
      'signal',
    ],
    active: false,
  },
  {
    name: 'BB',
    id: 'BollingerBands',
    params: {
      period: 8,
      stdDev: 2,
    },
    renderOnMain: true,
    valueIds: [
      'lower',
      'middle',
      'upper',
    ],
    active: false,
  },
  {
    name: 'ATR',
    id: 'ATR',
    params: {
      period: 14,
    },
    renderOnMain: false,
    valueIds: [
      'ATR',
    ],
    active: false,
  },
  {
    name: 'WEMA',
    id: 'WEMA',
    params: {
      period: 5,
    },
    renderOnMain: true,
    valueIds: [
      'WEMA',
    ],
    active: false,
  },
  {
    name: 'ROC',
    id: 'ROC',
    params: {
      period: 12,
    },
    renderOnMain: false,
    valueIds: [
      'ROC',
    ],
    active: false,
  },
  {
    name: 'KST',
    id: 'KST',
    params: {
      ROCPer1: 10,
      ROCPer2: 15,
      ROCPer3: 20,
      ROCPer4: 30,
      SMAROCPer1: 10,
      SMAROCPer2: 10,
      SMAROCPer3: 10,
      SMAROCPer4: 15,
      signalPeriod: 3,
    },
    renderOnMain: false,
    valueIds: [
      'kst',
      'signal',
    ],
    active: false,
  },
  {
    name: 'Stochastic',
    id: 'Stochastic',
    params: {
      period: 14,
      signalPeriod: 3,
    },
    renderOnMain: false,
    valueIds: [
      'k',
      'd',
    ],
    axisLines: [80, 20],
    active: false,
  },
  {
    name: 'Williams %R',
    id: 'WilliamsR',
    params: {
      period: 14,
    },
    renderOnMain: false,
    valueIds: [
      'WilliamsR',
    ],
    axisLines: [-20, -80],
    active: false,
  },
  {
    name: 'ADL',
    id: 'ADL',
    renderOnMain: false,
    valueIds: [
      'ADL',
    ],
    active: false,
  },
  {
    name: 'OBV',
    id: 'OBV',
    renderOnMain: false,
    valueIds: [
      'OBV',
    ],
    active: false,
  },
  {
    name: 'TRIX',
    id: 'TRIX',
    params: {
      period: 18,
    },
    renderOnMain: false,
    valueIds: [
      'TRIX',
    ],
    active: false,
  },
  {
    name: 'ADX',
    id: 'ADX',
    params: {
      period: 14,
    },
    renderOnMain: false,
    valueIds: [
      'ADX',
    ],
    active: false,
  }
];

const indicators = (state = INIT_INDICATORS_STATE, action) => {
  switch (action.type) {
    // mark an iundicator as selected
    case actionType.SELECT_INDICATOR:
      return state.map(i => (
        { ...i, selected: i.id === action.id ? !i.selected : i.selected }
      ));
    // edit an indicators parameters by updating the entire indicator object
    case actionType.EDIT_INDICATOR:
      return state.map(i => (
        i.id === action.indicator.id ? action.indicator : i
      ));
    default:
      return state;
  }
}

export default indicators;
