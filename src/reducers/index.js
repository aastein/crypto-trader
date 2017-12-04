import { combineReducers } from 'redux';

import exchanges from './exchanges';
import indicators from './indicators';
import location from './location';
import testData from './testData';
import scripts from './scripts';
import view from './view';

const reducer = combineReducers({
  exchanges,
  indicators,
  location,
  scripts,
  testData,
  view,
});

export default reducer;
