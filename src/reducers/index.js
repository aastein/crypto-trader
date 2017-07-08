import { combineReducers } from 'redux'
import { chart } from './chart'
import { profile } from './profile'
import { scripts } from './scripts'
import { indicators } from './indicators'
import { log } from './log'

const reducer = combineReducers({
  chart,
  profile,
  scripts,
  indicators,
  log
})

export default reducer
