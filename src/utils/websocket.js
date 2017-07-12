import moment from 'moment';

let connection;

/*
  produstList: array of product.id
  "product_ids": [
      "BTC-USD",
      "ETH-USD",
      "ETH-BTC"
  ]
*/
const subscribe = (productList) => {
  connection.send(JSON.stringify(
    {
      type: 'subscribe',
      product_ids: productList,
    },
  ));
};

const waitForConnected = (productList, initWSConnection) => {
  let n = 0;
  const t = setInterval(() => {
    if (connection.readyState === 1) {
      clearInterval(t);
      subscribe(productList);
    }
    n += 1;
    if (n > 4) {
      clearInterval(t);
      connection.close();
      connection = null;
      initWSConnection(productList);
    }
  }, 1000);
};

const initWSConnection = (productList, addWSData) => {
  const url = 'wss://ws-feed.gdax.com';
  connection = new WebSocket(url);

  /*
    {
      maker_order_id: "be66e6e5-3303-4844-9eaf-7ff1547a0383"
      price: "2612.09000000"
      product_id: "BTC-USD"
      sequence: 3489554377
      side: "sell"
      size: "0.09155277"
      taker_order_id: "0c711c5a-f54a-4698-aeed-30ca43eec8b1"
      time: "2017-07-04T03:21:45.250000Z"
      trade_id: 17706440
      type: "match"
    }
  */
  connection.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'match' || (data.type === 'done' && data.reason === 'filled')) {
      const price = parseFloat(data.price);
      const time = moment(data.time).valueOf();
      const size = parseFloat(data.size);
      const id = data.product_id;

      if (price && time && size && id) {
        if (typeof addWSData === 'function') {
          addWSData(id, time, price, size);
        }
      }
    }
  };
  waitForConnected(productList, initWSConnection);
};

export default initWSConnection;
