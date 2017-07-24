import axios from 'axios';
import * as actionType from './actionTypes';
import { getAccounts, getOrderBook, getProductData, getProducts } from '../utils/api';
import { INIT_RANGE, INIT_GRANULARITY } from '../utils/constants';
import connect, { setAction, subscribe } from '../utils/websocket';

let nextScriptId = 2;

// profile
export const importProfile = userData => ({ type: actionType.IMPORT_PROFILE, userData });
export const saveProfile = settings => ({ type: actionType.SAVE_PROFILE, settings });
export const updateAccounts = accounts => ({ type: actionType.UPDATE_ACCOUNTS, accounts });
export const addOrder = (id, productId, time, price) => ({ type: actionType.ADD_ORDER, id, productId, time, price });

// websocket
export const setProductWSData = (id, data) => ({ type: actionType.SET_PRODUCT_WS_DATA, id, data });
export const addProductWSData = data => ({ type: actionType.ADD_PRODUCT_WS_DATA, data });

// dashboard: charts
export const setProducts = products => ({ type: actionType.SET_PRODUCTS, products });
export const selectProduct = id => ({ type: actionType.SELECT_PRODUCT, id });
export const setProductData = (id, data) => ({ type: actionType.SET_PRODUCT_DATA, id, data });
export const addProductData = (id, data) => ({ type: actionType.ADD_PRODUCT_DATA, id, data });
export const selectDateRange = (id, range) => ({ type: actionType.SELECT_DATE_RANGE, id, range });
export const setGranularity = (id, granularity) =>
  ({ type: actionType.SET_GRANULARITY, id, granularity });
export const selectIndicator = id => ({ type: actionType.SELECT_INDICATOR, id });
export const editIndicator = indicator => ({ type: actionType.EDIT_INDICATOR, indicator });
export const updateOrderBook = (id, orderBook) =>
  ({ type: actionType.UPDATE_ORDER_BOOK, id, orderBook });
export const updateHeartbeat = status => ({ type: actionType.UPDATE_HEARTBEAT, status });
export const setFetchingStatus = status => ({ type: actionType.SET_FETCHING_STATUS, status });
export const calculateIndicators = id => ({ type: actionType.CALCULATE_INDICATORS, id });

// dashpbard: scratchpad
export const addScript = () => ({ type: actionType.ADD_SCRIPT, id: nextScriptId += 1 });
export const saveScript = script => ({ type: actionType.SAVE_SCRIPT, script });
export const deleteScript = id => ({ type: actionType.DELETE_SCRIPT, id });
export const selectScript = id => ({ type: actionType.SELECT_SCRIPT, id });
export const selectProductDoc = id => ({ type: actionType.SELECT_PRODUCT_DOC, id });
export const toggleScriptLive = id => ({ type: actionType.TOGGLE_SCRIPT_LIVE, id });
export const saveTestResult = result => ({ type: actionType.SAVE_TEST_RESULT, result });

// logging
export const appendLog = log => ({ type: actionType.APPEND_LOG, log });
export const clearLog = () => ({ type: actionType.CLEAR_LOG });

// location
export const setLocation = location => ({ type: actionType.SET_LOCATION, location });

// api
export const fetchAccounts = session => (
  dispatch => (
    getAccounts(session).then((accounts) => {
      if (accounts) dispatch(updateAccounts(accounts));
    })
  )
);

export const fetchOrderBook = id => (
  dispatch => (
    getOrderBook(id).then((ob) => {
      dispatch(updateOrderBook(id, ob));
    })
  )
);

export const fetchProductData = (id, range, granularity) => (
  (dispatch) => {
    dispatch(setFetchingStatus('fetching'));
    return getProductData(id, range, granularity).then((data) => {
      dispatch(setProductData(id, data));
      dispatch(setFetchingStatus('success'));
    }).catch((err) => {
      console.warn(err);
      dispatch(setFetchingStatus('failure'));
    });
  }
);

export const initWebsocket = ids => (
  dispatch => (
    connect().then(() => {
      setAction((data) => {
        dispatch(addProductWSData(data));
      });
      subscribe(ids);
    })
  )
);

export const initProducts = () => (
  (dispatch, getState) => (
    getProducts().then((products) => {
      dispatch(setProducts(products.data));
      const selectedProductIds = getState().profile.selectedProducts.map(p => (p.value));
      dispatch(selectProduct(selectedProductIds[0]));
      dispatch(fetchProductData(selectedProductIds[0], INIT_RANGE, INIT_GRANULARITY));
      for (let i = 0; i < selectedProductIds.length; i += 1) {
        dispatch(fetchOrderBook(selectedProductIds[i]));
      }
      dispatch(initWebsocket(selectedProductIds));
    })
  )
);

export const fetchSettings = acceptedFiles => (
  dispatch => (
    axios.create({ baseURL: '' }).get(acceptedFiles[0].preview).then((res) => {
      dispatch(importProfile(res.data));
      return res.data;
    })
  )
);
