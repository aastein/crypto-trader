import { combineReducers } from 'redux'
import { chart } from './chart'
import { profile } from './profile'
import { scripts } from './scripts'
import { docs } from './docs'
import { indicators } from './indicators'

const reducer = combineReducers({
  chart,
  profile,
  scripts,
  docs,
  indicators
})

export default reducer
