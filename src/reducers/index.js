import { combineReducers } from 'redux'
import { chart } from './chart'
import { profile } from './profile'
import { scripts } from './scripts'
import { log } from './log'

const reducer = combineReducers({
  chart,
  profile,
  scripts,
  log
})

export default reducer
