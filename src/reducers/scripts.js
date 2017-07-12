import * as actionType from '../actions/actionTypes';

const INITAL_SCRIPTS_STATE = [
  {
    id: 0,
    name: 'Custom',
    script: '',
    active: true,
    live: false,
  },
  {
    id: 1,
    name: 'Sell',
    script: 'sell()',
    active: false,
    live: false,
  },
  {
    id: 2,
    name: 'Buy',
    script: 'buy()',
    active: false,
    live: false,
  },
];

const scripts = (state = INITAL_SCRIPTS_STATE, action) => {
  switch (action.type) {
    case actionType.TOGGLE_SCRIPT_LIVE:
      return state.map(script => (
        script.id === action.id ? { ...script, live: !script.live } : script
      ));
    case actionType.ADD_SCRIPT:
      return [
        ...state,
        {
          id: action.id,
          name: 'New Script',
          script: '',
          active: false,
          live: false,
        },
      ];
    case actionType.SAVE_SCRIPT:
      return state.map(script => (
        script.id === action.script.id ?
          { ...script, script: action.script.script, name: action.script.name }
          : script
      ));
    case actionType.DELETE_SCRIPT:
      return state.filter(script =>
        !script.active,
      );
    case actionType.SELECT_SCRIPT:
      return state.map(script => (
        script.id === action.id ? { ...script, active: true } : { ...script, active: false }
      ));
    case actionType.IMPORT_PROFILE:
      return action.userData.scripts;
    default:
      return state;
  }
};

export default scripts;
