import { combineReducers } from 'redux';
import gdax from './gdax';

const exchanges = combineReducers({
  gdax,
});

export default exchanges;
