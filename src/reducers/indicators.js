import * as actionType from '../actions/actionTypes'

const INITAL_INDICATORS = [
  {
    id: "SRSI",
    params: {
      k: 0,
      d: 0
    },
    active: true
  }
]

export const indicators = (state = INITAL_INDICATORS, action) => {
  switch (action.type) {
    case actionType.SELECT_INDICATOR:
      return state.map( i => {
        if(i.id === action.id){
          i.active = true
        } else {
          i.active = false
        }
        return i
      })
    case actionType.EDIT_INDICATOR:
      return state.map( i => {
        if(i.id === action.id){
          i.params = action.params
        }
        return i
      })
    case actionType.IMPORT_PROFILE:
      return  action.userData.indicators
    default:
      return state
  }
}
