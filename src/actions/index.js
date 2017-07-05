import * as actionType from './actionTypes'

let nextScriptId = 0
export const saveProfile = profile => ({type: actionType.SAVE_PROFILE, profile})
export const setProducts = products => ({ type: actionType.SET_PRODUCTS, products})
export const setProduct = productId => ({ type: actionType.SET_PRODUCT, productId})
export const setProductData = (id, data) => ({ type: actionType.SET_PRODUCT_DATA, id, data })
export const setProductWSData = (id, ws_data) => ({ type: actionType.SET_PRODUCT_WS_DATA, id, ws_data})
export const setDateRange = (startDate, endDate) => ({type: actionType.SET_DATE_RANGE, startDate, endDate})
export const addScript = () => ({type: actionType.ADD_SCRIPT, id: nextScriptId++ })
export const saveScript = script => ({type: actionType.SAVE_SCRIPT, script})
export const deleteScript = () => ({type: actionType.DELETE_SCRIPT})
export const initDocs = () => ({type: actionType.INIT_DOCS})
export const selectScript = id => ({type: actionType.SELECT_SCRIPT, id})
export const selectDoc = name => ({type: actionType.SELECT_DOC, name})
export const setGranularity = (id, granularity) => ({type: actionType.SET_GRANULARITY, id, granularity})
export const initIndicators = () => ({type: actionType.INIT_INDICATORS})
export const selectIndicator = (id) => ({type: actionType.SELECT_INDICATOR, id})
export const editIndicator = (id, params) => ({type: actionType.EDIT_INDICATOR, id, params})
