import axios from 'axios';
import moment from 'moment';

const baseUrl = 'https://api.gdax.com';

const handleError = (error, setFetchingStatus) => {
  console.log('handling err');
  if (setFetchingStatus) setFetchingStatus(false);
  return console.warn(error);
};

const authRequest = (url, method, body, session) => {
  const headers = { 'CB-SESSION': session };
  const options = { method, headers, url: url, data: body };
  return axios(options);
};

const getUrl = (path) => (`${baseUrl}${path}`);

/*
 * Private Endpoints
*/

export const getOrder = (orderId, session) => {
  const url = getUrl(`/orders/${orderId}`);
  return authRequest(url, 'get', '', session).then(res => (
    res.data
  )).catch((error) => {
    if (error.response.status >= 400) {
      console.warn(`Find order failed. Order ID: ${orderId}`);
    }
    return error;
  });
};

export const getOrders = (product, session) => {
  const url = getUrl(`/orders?product_id=${product}`);
  return authRequest(url, 'get', '', session).then(res => (
    res.data
  )).catch((error) => {
    if (error.response.status >= 400) {
      console.warn(`Find orders failed. Product: ${product}`);
    }
    return error;
  });
}

export const getAccounts = (session) => {
  const url= getUrl('/accounts');
  return authRequest(url, 'get', '', session).then(res => (
    res.data
  )).catch((error) => {
    console.warn('Get accounts failed:', error.response.statusText);
    return error;
  });
};

export const deleteOrder = (orderId, session) => {
  const url = getUrl(`/orders/${orderId}`);
  return authRequest(url, 'delete', '', session).then(res => {
    return res.data;
  }).catch((error) => {
    console.warn('Cancel order failed. Order id: ', orderId, ", Message:", error.response.statusText);
    return error;
  });
}

export const getFills = (productId, session) => {
  const url = getUrl(`/fills?product_id=${productId}`);
  return authRequest(url, 'get', '', session).then(res => (
    res.data
  )).catch((error) => {
    console.warn('Get fills failed', error.response.statusText);
    return error;
  });
}

/*
 * Public Endpoints
*/

export const serverTime = () => {
  const url = getUrl('/time');
  return axios.get(url).then(res => (
    res.data
  )).catch(handleError);
};

export const getHistorialData = (product, startDate, endDate, gran) => {
  const granularity = Math.ceil(gran);
  const url = getUrl(`/products/${product}/candles?start=${startDate}&end=${endDate}&granularity=${granularity}`);
  return axios.get(url).then(res => (
    res.data.map(d => (
      {
        time: d[0] * 1000,
        low: d[1],
        high: d[2],
        open: d[3],
        close: d[4],
        volume: d[5],
      }
    ))
  ));
};

// GDAX doesnt like handling large requests, so if the requested range is too big to be
// served in a single response, split up into multiple requests
// GDAX also has a burst request limit so it is important to not initialize the app a rage so wide
// that it needs to split the requests
// granularity == 300000 = 30s => I want a data point every 30s
export const tryGetHistoricalData = (productId, time, range, desiredGranularity) => {
  // console.log('time', time)
  let rateConstant;
  let requests = [];
  const epochEnd = time.epoch;
  const epochDiff = range * 60; // ( minutes * (seconds / minute ) )
  const maxConcurrentRequests = 10;

  if (productId.includes('LTC')) {
    rateConstant = 400;
  } else if (productId.includes('BTC')) {
    rateConstant = 350;
  } else if (productId.includes('ETH')) {
    rateConstant = 350;
  }

  // ms * (ms / trade)^-1 => trade?
  //  console.log(epochDiff) // minutes
  const minGranularityIfSingleRequest = Math.ceil(epochDiff / rateConstant);
  const numRequsts = Math.ceil(minGranularityIfSingleRequest / desiredGranularity);
  const epochStep = Math.ceil(epochDiff / numRequsts);

  if (numRequsts <= maxConcurrentRequests) {
    for (let i = 0; i < numRequsts; i += 1) {
      const nStart = moment.unix(epochEnd - epochStep - (epochStep * i)).toISOString();
      const nEnd = moment.unix(epochEnd - (epochStep * i)).toISOString();
      const request = getHistorialData(productId, nStart, nEnd, desiredGranularity);
      requests = [...requests, request];
    }
    return axios.all(requests).then(
      axios.spread((...d) => (
        {
          epochEnd,
          data: d.reduce((a, b) => ([...a, ...b]), []),
        }
    ))).catch(err => (
      handleError(err)
    ));
  }
  return new Promise((resolve, reject) => (
    reject('Ganularity too small!')
  ));
};

export const getProductData = (id, range, granularity) => (
  serverTime().then(time => (
    tryGetHistoricalData(id, time, range, granularity).then(data => (
      data
    ))
  ))
);

export const getProducts = () => {
  const url = getUrl('/products');
  return axios.get(url);
};

export const postMarketOrder = (side, productId, price, session) => {
  const url = getUrl('/orders');
  const body = {
    type: 'market',
    side,
    product_id: productId,
    price,
  };
  return authRequest(url, 'post', body, session).then((res) => {
    const data = res.data;
    return data;
  }).catch((error) => {
    if (error.response) {
      // human readable error
      console.log(`Order Error: ${error.response.data.message}`);
    } else {
      console.log('Error', error);
    }
  });
}

export const postLimitOrder = (side, productId, price, size, session) => {
  const url = getUrl('/orders');
  const body = {
    type: 'limit',
    side,
    product_id: productId,
    price,
    size,
    time_in_force: 'GTC',
    post_only: true,
  };
  return authRequest(url, 'post', body, session).then((res) => {
    const data = res.data;
    return data;
  }).catch((error) => {
    if (error.response) {
      // human readable error
      console.log(`Order Error: ${error.response.data.message}`);
    } else {
      console.log('Error', error);
    }
  });
};
