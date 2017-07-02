import * as actionType from './actionTypes'

let nextScriptId = 0
export const saveProfile = profile => ({type: actionType.SAVE_PROFILE, profile})
export const setProducts = products => ({ type: actionType.SET_PRODUCTS, products})
export const setProduct = product => ({ type: actionType.SET_PRODUCTS, product})
export const setDateRange = (startDate, endDate) => ({type: actionType.SET_DATE_RANGE, startDate, endDate})
export const addScript = () => ({type: actionType.ADD_SCRIPT, id: nextScriptId++ })
export const saveScript = script => ({type: actionType.SAVE_SCRIPT, script})
export const deleteScript = id => ({type: actionType.DELETE_SCRIPT, id})
