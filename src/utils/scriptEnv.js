import { orderBook, placeOrder } from './api';

let products;
let profile;
let log;
let p;
let orderHist;
let addOrder;

const round = (value, decimals) => Number(`${Math.round(`${value}e${decimals}`)}e-${decimals}`);

const floor = (value, decimals) => Number(`${Math.floor(`${value}e${decimals}`)}e-${decimals}`);

const limitOrder = (side, productId) => {
  orderBook(productId).then((ob) => {
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
      price = round(Number(ob.bid), 2);
      size = floor(quoteAccount.available / price, 2);
    } else if (side === 'sell') {
      price = round(Number(ob.ask) - Number(quoteIncrement), 2);
      size = baseAccount.available;
    }
    if (profile.live) {
      if (size > 0) {
        placeOrder('limit', side, productId, price, size, profile.session, log).then((data) => {
          if (side === 'buy') {
            addOrder(data.product_id, data.created_at, -1 * data.price);
          } else if (side === 'sell') {
            addOrder(data.product_id, data.created_at, data.price);
          }
        }).catch(err => (err));
      }
    } else {
      log('Turn on live mode to execute orders.');
    }
  });
};

const buy = (id) => {
  limitOrder('buy', p.id);
};

const sell = (id) => {
  limitOrder('sell', p.id);
};

const run = (script, prods, prof, appendLog, dispatchAddOrder) => {
  // set global variables
  addOrder = dispatchAddOrder;
  log = appendLog;
  products = prods;
  profile = prof;
  p = products.reduce((a, b) => (
    b.active ? b : a
  ), {});
  const orders = profile.orders.filter(o => (
    o.id === p.id
  ));
  const lastOrder = orders.length > 0 ? orders[orders.length - 1] : {};

  try {
    // define variables avalable in the script
    const now = p.data ? p.data.length - 1 : 0;
    if (!profile.live) {
      log('Turn on live mode to execute orders.');
    }
    eval(script);
  } catch (err) {
    appendLog(`Script encountered error: ${err}`);
  }
};

export default run;
