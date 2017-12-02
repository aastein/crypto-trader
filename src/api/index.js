/*
  Every exchange must have these API methods:

  Private:
    getOrder - get specific open order
    getOrders - get all open orders
    getAccounts - get all account balances
    deleteOrder - delete an active order
    getFills - get historical order fills
    postMarketOrder - post a market order
    postLimitOrder - post a limit order

  Public:
    getProductData - get histroical price data
    getProducts - get tradable pairs

*/

import * as gdax from './gdax';

const api = {
  gdax,
};

export default api;
