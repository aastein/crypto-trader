import * as actionType from '../actions/actionTypes';

const INITAL_VIEW_STATE = {
  topCenter: [
    { id: 'Line', selected: true },
    { id: 'Order Book', selected: false }
  ],
  topRight: [
    { id: 'Order Book', selected: true },
    { id: 'Log', selected: false },
  ],
  bottomLeft: [
    {id: 'Scripts', selected: true },
    {id: 'Orders', selected: false },
  ],
  bottomRight: [
    {id: 'Trade History', selected: false },
    {id: 'Trade', selected: true },
  ],
};

// action.card action.content
const view = (state = INITAL_VIEW_STATE, action) => {
  // console.log('reducer', action.type, JSON.stringify(action).length);
  switch (action.type) {
    case actionType.SHOW_CARD: // switch between showing content in cards
      const newState = { ...state };
      newState[action.card] = [...state[action.card].map(content => {
        console.log(action.content === content.id)
        return { ...content, selected: action.content === content.id };
      })];
      console.log(newState);
      return newState;
    default:
      return state;
  }
};

export default view;
