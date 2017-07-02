import { combineReducers } from 'redux'
import { chart } from './chart'
import { profile } from './profile'
import { scripts } from './scripts'

const reducer = combineReducers({
  chart,
  profile,
  scripts
})

export default reducer
