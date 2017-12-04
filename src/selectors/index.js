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

export const ticker = (product) => {
  return product.ticker ? product.ticker : {};
}

export const accounts = (exchange) => {
  return exchange.accounts ? exchange.accounts : [];
}

export const selectedProduct = (exchange) => {
  return exchange.products ? exchange.products.find(p => {
    return p.active;
  }) : {};
}

export const productId = (product) => {
  return product.id ? product.id : '';
}

export const matches = (product) => {
  return product.matches ? product.matches.map(d => ([d.time, d.price, d.size])) : [];
}

export const productData = (product) => {
  return product.data ? product.data : [];
}

export const granularity = (product) => {
  return product.granularity ? product.granularity : 0;
}

export const orders = (product) => {
  return product.orders ? product.orders : [];
}

export const fills = (product) => {
  return product.fills ? product.fills : [];
}

export const currencyAccount = (exchange, currency) => {
  return exchange.accounts.find(a => (a.currency === currency));
}
