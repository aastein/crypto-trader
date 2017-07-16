import { combineReducers } from 'redux';
import chart from './chart';
import profile from './profile';
import scripts from './scripts';
import log from './log';
import websocket from './websocket';

const reducer = combineReducers({
  chart,
  profile,
  scripts,
  log,
  websocket,
});

export default reducer;
