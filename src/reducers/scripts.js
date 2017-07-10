import * as actionType from '../actions/actionTypes'

let INITAL_SCRIPTS_STATE = [
  {
    id: 0,
    name: 'Buy LTC',
    script: 'log(p.data[now])',//'limitOrder("buy", p.id)',
    active: true,
    live: false
  },
  {
    id: 1,
    name: 'Sell LTC',
    script: 'limitOrder("sell", p.id)',
    active: false,
    live: false
  }
]

export const scripts = (state = INITAL_SCRIPTS_STATE, action) => {
  switch (action.type) {
    case actionType.TOGGLE_SCRIPT_LIVE:
    return state.map(script =>
      (script.id === action.id) ? { ...script, live: !script.live } : script
    )
    case actionType.ADD_SCRIPT:
      return [
        ...state,
        {
          id: action.id,
          name: 'New Script',
          script: '',
          active: false
        }
      ]
    case actionType.SAVE_SCRIPT:
      return state.map(script =>
        (script.id === action.script.id)
          ? { ...script, script: action.script.script, name: action.script.name }
          : script
      )
    case actionType.DELETE_SCRIPT:
      return state.filter(script =>
        !script.active
      )
    case actionType.SELECT_SCRIPT:
      return state.map(script =>
        (script.id === action.id) ? { ...script, active: true } : { ...script, active: false }
      )
    case actionType.IMPORT_PROFILE:
      return  action.userData.scripts
    default:
      return state
  }
}
