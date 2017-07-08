import { combineReducers } from 'redux'
import { products } from './products'
import { settings } from './settings'

const chart = combineReducers({
  products,
  settings
})

export default chart
