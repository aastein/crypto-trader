import { combineReducers } from 'redux'
import { chart } from './chart'
import { profile } from './profile'
import { scripts } from './scripts'
import { docs } from './docs'

const reducer = combineReducers({
  chart,
  profile,
  scripts,
  docs
})

export default reducer
