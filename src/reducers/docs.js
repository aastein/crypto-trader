import * as actionType from '../actions/actionTypes'

const INITIAL_DOCS = [
  {
    name: 'LTC_EUR',
    desc: 'params: time\nExample: LTC_EUR(1496160000000)',
    active: false
  },
  {
    name: 'LTC_BTC',
    desc: 'params: time\nExample: LTC_BTC(1496160000000)',
    active: false
  },
  {
    name: 'BTC_GBP',
    desc: 'params: time\nExample: BTC_GBP(1496160000000)',
    active: false
  },
  {
    name: 'BTC_EUR',
    desc: 'params: time\nExample: BTC_EUR(1496160000000)',
    active: false
  },
  {
    name: 'ETH_EUR',
    desc: 'params: time\nExample: ETH_EUR(1496160000000)',
    active: false
  },
  {
    name: 'ETH_BTC',
    desc: 'params: time\nExample: ETH_BTC(1496160000000)',
    active: false
  },
  {
    name: 'LTC_USD',
    desc: 'params: time\nExample: LTC_USD(1496160000000)',
    active: false
  },
  {
    name: 'BTC_USD',
    desc: 'params: time\nExample: BTC_USD(1496160000000)',
    active: false
  },
  {
    name: 'ETH_USD',
    desc: 'params: time\nExample: ETH_USD(1496160000000)',
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
