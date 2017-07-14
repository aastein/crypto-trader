import * as actionType from './actionTypes';

let nextScriptId = 3;

// profile
export const importProfile = userData => ({ type: actionType.IMPORT_PROFILE, userData });
export const saveProfile = settings => ({ type: actionType.SAVE_PROFILE, settings });
export const updateAccounts = accounts => ({ type: actionType.UPDATE_ACCOUNTS, accounts });

// websocket
export const setProductWSData = (id, data) => ({ type: actionType.SET_PRODUCT_WS_DATA, id, data });
export const addProductWSData = (id, time, price, size) =>
    ({ type: actionType.ADD_PRODUCT_WS_DATA, id, time, price, size });

// dashboard: charts
export const setProducts = products => ({ type: actionType.SET_PRODUCTS, products });
export const selectProduct = id => ({ type: actionType.SELECT_PRODUCT, id });
export const setProductData = (id, data) => ({ type: actionType.SET_PRODUCT_DATA, id, data });
export const selectDateRange = (id, range) => ({ type: actionType.SELECT_DATE_RANGE, id, range });
export const setGranularity = (id, granularity) =>
  ({ type: actionType.SET_GRANULARITY, id, granularity });
export const selectIndicator = id => ({ type: actionType.SELECT_INDICATOR, id });
export const editIndicator = (id, params) => ({ type: actionType.EDIT_INDICATOR, id, params });
export const updateOrderBook = (id, orderBook) =>
  ({ type: actionType.UPDATE_ORDER_BOOK, id, orderBook });
export const updateHeartbeat = status => ({ type: actionType.UPDATE_HEARTBEAT, status });

// dashpbard: scratchpad
export const addScript = () => ({ type: actionType.ADD_SCRIPT, id: nextScriptId += 1 });
export const saveScript = script => ({ type: actionType.SAVE_SCRIPT, script });
export const deleteScript = () => ({ type: actionType.DELETE_SCRIPT });
export const selectScript = id => ({ type: actionType.SELECT_SCRIPT, id });
export const selectProductDoc = id => ({ type: actionType.SELECT_PRODUCT_DOC, id });
export const toggleScriptLive = id => ({ type: actionType.TOGGLE_SCRIPT_LIVE, id });
export const saveTestResult = result => ({ type: actionType.SAVE_TEST_RESULT, result });

// logging
export const appendLog = log => ({ type: actionType.APPEND_LOG, log });
export const clearLog = () => ({ type: actionType.CLEAR_LOG });
