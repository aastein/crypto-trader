export const selectedExchange = (state) => {
  return Object.keys(state.exchanges).reduce((se, ex) => {
    if (state.exchanges[ex].selected) {
      return state.exchanges[ex];
    } else {
      return se;
    }
  }, {});
}

export const tickers = (exchange) => {
  return exchange.products ? exchange.products.map(product => {
    const ticker = product.ticker;
    return {
        name: product.name,
        bid: ticker ? ticker.bestBid : '',
        ask: ticker ? ticker.bestAsk : '',
      }
  }) : [];
}

export const accounts = (exchange) => {
  return exchange.accounts ? exchange.accounts : [];
}

export const selectedProduct = (exchange) => {
  const product = exchange.products ? exchange.products.find(p => {
    return p.selected;
  }) : {};
  return product ? product : {};
}

export const currencyAccount = (exchange, currency) => {
  return exchange.accounts.find(a => (a.currency === currency));
}

export const ticker = (product) => {
  return product && product.ticker ? product.ticker : {};
}

export const productId = (product) => {
  return product && product.id ? product.id : '';
}

export const matchesForChart = (product) => {
  return product && product.matches ? product.matches.map(d => ([d.time, d.price, d.size])) : [];
}

export const matches = (product) => {
  return product && product.matches ? product.matches : [];
}

export const productData = (product) => {
  return product && product.data ? product.data : [];
}

export const granularity = (product) => {
  return product && product.granularity ? product.granularity : 0;
}

export const orders = (product) => {
  return product && product.orders ? product.orders : [];
}

export const fills = (product) => {
  return product && product.fills ? product.fills : [];
}

export const productName = (product) => {
  return product && product.display_name ? product.display_name : '';
}

export const activeOrders = (product) => {
  return product && product.activeOrders ? product.activeOrders : [];
};

export const exchangeActiveOrders = (exchange) => {
  return exchange.products ?
    exchange.products.reduce((orders, product) => {
      return [ ...orders, activeOrders(product)]
    }, [])
    : [];
}

export const allExchangeActiveOrders = (state) => {
  return Object.keys(state.exchanges).reduce((orders, exchange) => {
    return [ ...orders, exchangeActiveOrders(state.exchanges[exchange]) ];
  }, []);
}

export const productIndicatorData = (product, indicatorId) => {
  return product[indicatorId] ? product[indicatorId] : [];
}
