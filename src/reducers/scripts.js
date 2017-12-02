import * as actionType from '../actions/actionTypes';

const INITAL_SCRIPTS_STATE = [
  {
    id: 0,
    name: 'Header',
    script: "// This is the header script. Declare variables here that will be in the scope of all custom scripts.",
    active: false,
    live: false,
  },
  {
    id: 1,
    name: 'Example',
    script: "// This is an example script. Click the Test button to see how it works.\n\nif (kInBuy) {\n  buy('kInBuy')\n} else if (kInSell) {\n  sell('kInSell')\n}",
    active: true,
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
        !script.active || script.id === 0,
      ).map(s => (
        { ...s, active: s.id === 0 }
      ));
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
