import * as actionType from '../../actions/actionTypes'

const INITAL_STATE = {
  dateRanges: [
    { label: '1 minute', value: 1},
    { label: '5 minutes', value: 5},
    { label: '10 minute', value: 10},
    { label: '30 minutes', value: 30},
    { label: '1 hour', value: 60},
    { label: '3 hours', value: 180},
    { label: '6 hours', value: 360},
    { label: '1 day', value: 1440},
    { label: '10 days', value: 14400},
    { label: '30 days', value: 43200}
  ],
  indicators: [{
    id: "SRSI",
    params: {
      rsiPeriod: 14,
      stochPeriod: 14,
      kPeriod: 0,
      dPeriod: 0
    },
    active: true
  },
  {
    id: "RSI",
    params: {
      period: 14,
    },
    active: false
  },
  {
    id: "CCI",
    params: {
      period: 20
    },
    active: false
  }]
}

export const settings = (state = INITAL_STATE, action) => {
  switch (action.type) {
    case actionType.SELECT_INDICATOR:
      return { ...state,
        indicators: state.indicators.map( i => {
          if(i.id === action.id){
            i.active = true
          } else {
            i.active = false
          }
          return i
        })
      }
    case actionType.EDIT_INDICATOR:
      return { ...state,
        indicators: state.indicators.map( i => {
          if(i.id === action.id){
            i.params = action.params
          }
          return i
        })
      }
    case actionType.IMPORT_PROFILE:
      return  { ...state, indicators: action.userData.indicators }
    default:
      return state
  }
}
