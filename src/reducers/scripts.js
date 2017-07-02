import * as actionType from '../actions/actionTypes'

export const scripts = (state = [], action) => {
  switch (action.type) {
    case actionType.ADD_SCRIPT:
      return [
        ...state,
        {
          id: action.id,
          script: ''
        }
      ]
    case actionType.SAVE_SCRIPT:
      return state.map(script =>
          (script.id === action.id)
            ? { ...script, script: script.script, name: script.name }
            : script
      )
    case actionType.DELETE_SCRIPT:
      return state.filter(script =>
          (!script.id === action.id)
      )
    default:
      return state
  }
}
