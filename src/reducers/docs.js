import * as actionType from '../actions/actionTypes'

const INITIAL_DOCS = [
  {
    name: 'BTC-USD',
    desc: 'BTC-USD',
    active: false
  }
]

export const docs = (state = INITIAL_DOCS, action) => {
  switch (action.type) {
    case actionType.INIT_DOCS:
      return { ...state, docs: INITIAL_DOCS }
    case actionType.SELECT_DOC:
      return state.map( doc => {
        if(doc.name === action.name)
            doc.active = !doc.active
        return doc
      })
    default:
      return state
  }
}
