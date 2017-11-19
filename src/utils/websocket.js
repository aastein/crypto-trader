let connection;
const url = 'wss://ws-feed.gdax.com';

// set the action to be dispatched when data is received
export const setActions = (handleMatch, handleSnapshot, handleUpdate) => {
  connection.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case 'snapshot':
        // initialize the orderbook
        handleSnapshot(data);
        break;
      case 'l2update':
        // update portion of the orderbook
        handleUpdate(data);
        break;
      case 'last_match':
        // initalize realtime price
        // this could be (probably is) duplicate of REST historical data
        break;
      case 'match':
        // update realtime price
        handleMatch(data);
        break;
      default:
        console.log('no websocket handler for: ', data.type);
    }
  };
};

// subscribe with an array of product ids
export const subscribe = (products) => {
  connection.send(JSON.stringify(
    {
      type: 'subscribe',
      product_ids: products,
      channels: [
        'level2',
        'matches',
      ],
    },
  ));
};

// connect to GDAX websocket
const connect = () => (
  new Promise((resolve, reject) => {
    // check for exising connection
    if (!connection || connection.redystate !== 1) {
      // open the connection and wait 5s for connection.
      connection = new WebSocket(url);
      let n = 0;
      const t = setInterval(() => {
        if (connection.readyState === 1) {
          clearInterval(t);
          resolve();
        } else if (n > 5) {
          clearInterval(t);
          connection.close();
          reject(`Could not connect to ${url}`);
        }
        n += 1;
      }, 1000);
    }
  })
);

export default connect;
