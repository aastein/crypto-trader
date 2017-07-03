import * as actionType from '../actions/actionTypes'

export const scripts = (state = [], action) => {
  switch (action.type) {
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
        (script.id === action.id)
          ? { ...script, active: true }
          : { ...script, active: false }
        )
    default:
      return state
  }
}
