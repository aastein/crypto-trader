import * as actionType from '../actions/actionTypes'

const INITAL_LOG_STATE = [
  {
    time: new Date().getTime(),
    message: 'Welcome!'
  }
]

export const log = (state = INITAL_LOG_STATE, action) => {
  switch(action.type) {
    case actionType.APPEND_LOG:
      let message = action.log
      if(typeof action.log === 'object'){
        message = JSON.stringify(action.log)
      }
      return [ ...state, { message, time: new Date().getTime()} ]
    case actionType.CLEAR_LOG:
      return []
    default:
      return state
  }
}
