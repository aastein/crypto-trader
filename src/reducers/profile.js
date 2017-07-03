import * as actionType from '../actions/actionTypes'

const INITAL_PROFILE_STATE = {
  session: '',
  live: false,
}

export const profile = (state=INITAL_PROFILE_STATE, action) => {
  switch(action.type) {
    case actionType.SAVE_PROFILE:
      return { ...state, ...action.profile }
    default:
      return state
  }
}
