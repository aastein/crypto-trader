import { placeLimitOrder, getOrder } from './api';
import { round, floor } from './math';

let products;
let profile;
let log;
let p;
let orderHist;
let addOrder;
let config;

// limit order at the spread line
const limitOrder = (side, productId, orderbook) => {
  const product = products.reduce((a, b) => (
    b.id === productId ? b : a
  ), {});
  const baseCurrency = product.base_currency; // BTC
  // let baseIncrement = product.base_min_size // 0.01
  const quoteCurrency = product.quote_currency; // USD
  const quoteIncrement = product.quote_increment; // 0.01
  const quoteAccount = profile.accounts.reduce((a, b) => (
    b.currency === quoteCurrency ? b : a
  ), {});
  const baseAccount = profile.accounts.reduce((a, b) => (
    b.currency === baseCurrency ? b : a
  ), {});
  let price;
  let size;
  // set account to account which will be handling the trade
  // set price to best price +/- quote increment
  if (side === 'buy') {
    price = round(Number(orderbook.bid), 2);
    size = floor(quoteAccount.available / price, 2);
  } else if (side === 'sell') {
    price = round(Number(orderbook.ask) - Number(quoteIncrement), 2);
    size = baseAccount.available;
  }
  if (profile.live) {
    if (size > 0) {
      placeLimitOrder('limit', side, productId, price, size, profile.session, log).then((data) => {
        if (side === 'buy') {
          addOrder(data.id, data.product_id, data.created_at, -1 * data.price);
        } else if (side === 'sell') {
          addOrder(data.id, data.product_id, data.created_at, data.price);
        }
      }).catch(err => (err));
    }
  } else {
    log('Turn on live mode to execute orders.');
  }
};

// todo: pass in orderbook for the user
const buy = (id, orderbook) => {
  limitOrder('buy', p.id, orderbook);
};

// todo: pass in orderbook for the user
const sell = (id, orderbook) => {
  limitOrder('sell', p.id, orderbook);
};

const run = (header, script, prods, prof, appendLog, dispatchAddOrder) => {
  // set config object for async retry
  config = {
    header,
    script,
    prods,
    prof,
    appendLog,
    dispatchAddOrder,
  };

  // set global variables
  products = prods;
  profile = prof;
  log = appendLog;
  addOrder = dispatchAddOrder;

  p = products.reduce((a, b) => (
    b.active ? b : a
  ), {});
  const orders = profile.orders.filter(o => (
    o.id === p.id
  ));
  const lastOrder = orders.length > 0 ? orders[orders.length - 1] : {};
  const scriptWithHeader = header + ';' + script;

  try {
    // define variables avalable in the script
    const now = p.data ? p.data.length - 1 : 0;
    if (!profile.live) {
      log('Turn on live mode to execute orders.');
    }
    eval(scriptWithHeader);
  } catch (err) {
    appendLog(`Script encountered error: ${err}`);
  }
};

const checkOrderStatus = (id, session) => {
  setTimeout(() => {
    getOrder(id, session).then((res) => {
      if (res.settled) {
        if (res.size !== res.filled_size) {
          // rerun script to reexecute order maybe
          run(config.header, config.script, config.prods, config.prof, config.appendLog, config.dispatchAddOrder);
        }
      } else {
        run(config.header, config.script, config.prods, config.prof, config.appendLog, config.dispatchAddOrder);
      }
    });
  }, 61000);
};

export default run;
