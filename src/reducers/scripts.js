import * as actionType from '../actions/actionTypes';

const INITAL_SCRIPTS_STATE = [
  {
    id: 0,
    name: 'Example',
    script: "// This is an example script. Click the Test button to see how it works.\n\nlet buyLine = 0.2\nlet sellLine = 0.8\nlet lastK = p.srsi[now - 1].k\nlet lastD = p.srsi[now - 1].d\nlet nowK = p.srsi[now].k\nlet nowD = p.srsi[now].d\nlet lastKOverD = lastK > lastD\nlet nowKOverD = nowK > nowD\nlet lastKOverBuy = lastK > buyLine\nlet nowKOverBuy = nowK > buyLine\n\nlet rebound = !lastKOverD && nowKOverD && nowKOverBuy\nlet kOverBuy = !lastKOverBuy && nowKOverBuy && nowKOverD\n\nif(rebound){\n  buy('reboud')\n} else if(kOverBuy){\n  buy('kOverBuy')\n}else if (lastKOverD){\n  sell('lastKOverD')\n} else if(!nowKOverD) {\n  sell('!nowKOverD')\n}",
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
