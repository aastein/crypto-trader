import * as actionType from './actionTypes';

// exchanges
  // accounts
export const setAccounts = (exchange, accounts) => ({ type: actionType.SET_ACCOUNTS, exchange, accounts });

  // orders
export const setOrders = (exchange, product, orders) => ({ type: actionType.SET_ORDERS, exchange, product, orders});
export const addOrder = (exchange, id, productId, time, price) => ({ type: actionType.ADD_ORDER, exchange, id, productId, time, price });

  // active orders
export const addActiveOrder = (exchange, productId, order) => ({ type: actionType.ADD_ACTIVE_ORDER, exchange, productId, order });
export const deleteActiveOrder = (exchange, productId, orderId) => ({ type: actionType.DELETE_ACTIVE_ORDER, exchange, productId, orderId });

  // fills
export const setFills = (exchange, productId, fills) => ({ type: actionType.SET_FILLS, exchange, productId, fills });

  // realtime data
export const setMatchData = (exchange, id, data) => ({ type: actionType.SET_MATCH_DATA, exchange, id, data });
export const addMatchData = (exchange, data) => ({ type: actionType.ADD_MATCH_DATA, exchange, data });
export const setTickerData = (exchange, data) => ({type: actionType.SET_TICKER_DATA, exchange, data});
export const setOrderBook = (exchange, id, orderBook) => ({ type: actionType.SET_ORDER_BOOK, exchange, id, orderBook });
export const updateOrderBook = (exchange, id, changes) => ({ type: actionType.UPDATE_ORDER_BOOK, exchange, id, changes });
export const updateHeartbeat = (exchange, status) => ({ type: actionType.UPDATE_HEARTBEAT, exchange, status });

  // products
export const setProducts = (exchange, products) => ({ type: actionType.SET_PRODUCTS, exchange, products });
export const selectProduct = (exchange, id) => ({ type: actionType.SELECT_PRODUCT, exchange, id });

  // historical data
export const setProductData = (exchange, id, data, indicators) => ({ type: actionType.SET_PRODUCT_DATA, exchange, id, data, indicators });
export const addProductData = (exchange, id, data, indicators) => ({ type: actionType.ADD_PRODUCT_DATA, exchange, id, data, indicators });
export const setDateRange = (exchange, id, range) => ({ type: actionType.SET_DATE_RANGE, exchange, id, range });
export const setGranularity = (exchange, id, granularity) => ({ type: actionType.SET_GRANULARITY, exchange, id, granularity });
export const setFetchingStatus = (exchange, status) => ({ type: actionType.SET_FETCHING_STATUS, exchange, status });
export const _calculateIndicators = (exchange, id, indicators) => ({ type: actionType.CALCULATE_INDICATORS, exchange, id, indicators });

// exchange: gdax
export const saveSession = session => ({ type: actionType.SAVE_SESSION, exchange: 'gdax', session });

// indicators
export const selectIndicator = id => ({ type: actionType.SELECT_INDICATOR, id });
export const editIndicator = indicator => ({ type: actionType.EDIT_INDICATOR, indicator });

// scripts
export const addScript = () => ({ type: actionType.ADD_SCRIPT });
export const saveScript = script => ({ type: actionType.SAVE_SCRIPT, script });
export const deleteScript = id => ({ type: actionType.DELETE_SCRIPT, id });
export const selectScript = id => ({ type: actionType.SELECT_SCRIPT, id });
export const toggleScriptLive = id => ({ type: actionType.TOGGLE_SCRIPT_LIVE, id });
export const saveTestResult = result => ({ type: actionType.SAVE_TEST_RESULT, result });

// location
export const setLocation = location => ({ type: actionType.SET_LOCATION, location });

// view
export const showCard = (card, content) => ({ type: actionType.SHOW_CARD, card, content });
