import * as actionType from '../actions/actionTypes';

const INITAL_SCRIPTS_STATE = [
  {
    id: 0,
    name: 'Header',
    script: "// This is the header script. Declare variables here that will be in the scope of all custom scripts.",
    selected: false,
    live: false,
  },
  {
    id: 1,
    name: 'Example',
    script: "// This is an example script. Click the Test button to see how it works.",
    selected: true,
    live: false,
  },
];

const scripts = (state = INITAL_SCRIPTS_STATE, action) => {
  switch (action.type) {
    // toggle the live flag of a script. live flag is used to determine which scripts to run
    case actionType.TOGGLE_SCRIPT_LIVE:
      return state.map(script => (
        script.id === action.id ? { ...script, live: !script.live } : script
      ));
    // add a new empty script
    case actionType.ADD_SCRIPT:
      return [
        ...state,
        {
          id: state[state.length - 1].id + 1,
          name: 'New Script',
          script: '',
          active: false,
          live: false,
          store: {},
        },
      ];
    // save a scripts script content
    case actionType.SAVE_SCRIPT:
      return state.map(script => (
        script.id === action.script.id ?
          { ...script, script: action.script.script, name: action.script.name }
          : script
      ));
    // delete a script
    case actionType.DELETE_SCRIPT:
      // retain all scripts where id not match action.id
      return state.filter(script => (
        script.id !== action.id
      ));
    // mark a script as selected with the selected flag
    case actionType.SELECT_SCRIPT:
      return state.map(script => (
        script.id === action.id ? { ...script, selected: true } : { ...script, selected: false }
      ));
    default:
      return state;
  }
};

export default scripts;
