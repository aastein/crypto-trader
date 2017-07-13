import * as actionType from '../actions/actionTypes';
import calculateIndicators from '../utils/indicators';
import { INIT_RANGE, INIT_GRANULARITY } from '../utils/constants';

const INITAL_CHART_STATE = {
  indicators: [{
    id: 'SRSI',
    params: {
      rsiPeriod: 14,
      stochPeriod: 14,
      kPeriod: 3,
      dPeriod: 3,
    },
    active: true,
  },
  {
    id: 'Meta RSI',
    params: {
      rsiPeriod: 14,
      stochPeriod: 14,
      kPeriod: 3,
      dPeriod: 3,
    },
    active: false,
  },
  {
    id: 'RSI',
    params: {
      period: 14,
    },
    active: false,
  },
  {
    id: 'CCI',
    params: {
      period: 20,
    },
    active: true,
  }],
  dateRanges: [
    { label: '1 minute', value: 1 },
    { label: '5 minutes', value: 5 },
    { label: '10 minute', value: 10 },
    { label: '30 minutes', value: 30 },
    { label: '1 hour', value: 60 },
    { label: '3 hours', value: 180 },
    { label: '6 hours', value: 360 },
    { label: '1 day', value: 1440 },
    { label: '5 days', value: 7200 },
    { label: '10 days', value: 14400 },
    { label: '1 Month', value: 43200 },
    { label: '3 Months', value: 129600 },
    { label: '6 Months', value: 259200 },
    { label: '1 Year', value: 518400 },
  ],
  products: [],
  testResult: {},
};

const chart = (state = INITAL_CHART_STATE, action) => {
  switch (action.type) {
    case actionType.SAVE_TEST_RESULT:
      return { ...state, testResult: action.result };
    case actionType.UPDATE_HEARTBEAT:
      return { ...state, websocket: { ...state.websocket, connected: action.status } };
    case actionType.SELECT_INDICATOR:
      return { ...state,
        indicators: state.indicators.map((i) => {
          const indicator = i;
          if (i.id === action.id) {
            indicator.active = true;
          } else {
            indicator.active = false;
          }
          return indicator;
        }),
      };
    case actionType.EDIT_INDICATOR:
      return { ...state,
        indicators: state.indicators.map((i) => {
          const indicator = i;
          if (i.id === action.id) {
            indicator.params = action.params;
          }
          return i;
        }),
      };
    case actionType.UPDATE_ORDER_BOOK:
      return { ...state,
        products: state.products.map((p) => {
          const product = p;
          product.bid = p.id === action.id ? action.orderBook.bid : p.bid;
          product.ask = p.id === action.id ? action.orderBook.ask : p.ask;
          return product;
        }),
      };
    case actionType.SELECT_PRODUCT_DOC:
      return { ...state,
        products: state.products.map((p) => {
          const product = p;
          product.docSelected = p.id === action.id ? !p.docSelected : p.docSelected;
          return product;
        }),
      };
    case actionType.SELECT_DATE_RANGE:
      return { ...state,
        products: state.products.map((p) => {
          const product = p;
          product.range = p.id === action.id ? action.range : p.range;
          return product;
        }),
      };
    case actionType.SET_GRANULARITY:
      return { ...state,
        products: state.products.map((p) => {
          const product = p;
          if (product.id === action.id) {
            return { ...product, granularity: parseInt(action.granularity, 10) };
          }
          return product;
        }),
      };
    case actionType.SET_PRODUCTS:
      return { ...state,
        products: action.products.map(product => (
          { ...product, granularity: INIT_GRANULARITY, range: INIT_RANGE, data: [], docSelected: false, bid: '', ask: '' }
        )),
      };
    case actionType.SELECT_PRODUCT:
      return { ...state,
        products: state.products.map((p) => {
          const product = p;
          product.active = p.id === action.id;
          return product;
        }),
      };
    case actionType.SET_PRODUCT_DATA:
      return { ...state,
        products: state.products.map((p) => {
          const product = p;
          if (product.id === action.id && action.data) {
            let data = [...action.data.data];
            const endDate = action.data.epochEnd * 1000;
            const startDate = endDate - (product.range * 60000); // (minutes * ( ms / minute)*1000)
            const dates = [];
            let lastTime = 0;

            data = data.sort((a, b) => {
              if (a.time < b.time) return -1;
              if (a.time > b.time) return 1;
              return 0;
            }).filter((d) => {
              const isDupe = dates.indexOf(d.time) > 0;
              const isInTimeRange = d.time >= startDate && d.time <= endDate;
              dates.push(d.time);
              if (d.time - lastTime >= product.granularity * 1000) {
                lastTime = d.time;
                return true && !isDupe && isInTimeRange;
              }
              return false;
            });
            const inds = calculateIndicators(state.indicators, data);
            return { ...product,
              data,
              srsi: inds.srsi,
              rsi: inds.rsi,
              cci: inds.cci,
              metasrsi: inds.metasrsi,
            };
          }
          return product;
        }),
      };
    case actionType.IMPORT_PROFILE:
      return { ...state,
        indicators: action.userData.indicators,
        products: state.products.map((p) => {
          for (let i = 0; i < action.userData.products.length; i += 1) {
            if (action.userData.products[i].id === p.id) {
              return ({ ...p,
                id: action.userData.products[i].id,
                granularity: action.userData.products[i].granularity,
                range: action.userData.products[i].range,
                docSelected: action.userData.products[i].docSelected,
                active: action.userData.products[i].active,
              });
            }
          }
          return p;
        }),
      };
    default:
      return state;
  }
};

export default chart;
