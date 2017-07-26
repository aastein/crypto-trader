let connection;
const url = 'wss://ws-feed.gdax.com';

// set the action to be dispatched when data is received
export const setAction = (action) => {
  connection.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // only watch for completed trades / filter out order posts and cancels
    if (data.type === 'match' || (data.type === 'done' && data.reason === 'filled')) {
      action(data);
    }
  };
};

// subscribe with an array of product ids
export const subscribe = (products) => {
  connection.send(JSON.stringify(
    {
      type: 'subscribe',
      product_ids: products,
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
