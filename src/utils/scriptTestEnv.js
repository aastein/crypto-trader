let products;
let p;
let orderHist;
/*
if(p.srsi[now - 1].k < 0.2 && p.srsi[now].k >= 0.2){
  buy()
} else if (p.srsi[now - 1].k > 0.8 && p.srsi[now].k <= 0.8){
  sell()
}
*/
const round = (value, decimals) => Number(`${Math.round(`${value}e${decimals}`)}e-${decimals}`);

const test = (script, prods, appendLog) => {
  const log = appendLog;
  orderHist = [];
  products = prods;
  p = products.reduce((a, b) => (
    b.active ? b : a
  ), {});

  for (let i = 1; i < p.data.length - 1; i += 1) {
    const now = i;
    const lastOrder = orderHist.length > 0 ? orderHist[orderHist.length - 1] : {};
    const order = { time: p.data[i + 1].time, balance: 0 };

    try {
      const buy = (id) => {
        if (orderHist.length === 0) {
          orderHist = [...orderHist, { ...order, balance: (-1) * p.data[i + 1].open }];
        } else if (orderHist[orderHist.length - 1].balance > 0) {
          orderHist = [...orderHist, { ...order, label: id, balance: (-1) * p.data[i + 1].open }];
        }
      };

      const sell = (id) => {
        if (orderHist.length !== 0) {
          if (orderHist[orderHist.length - 1].balance) {
            if (orderHist[orderHist.length - 1].balance < 0) {
              orderHist = [...orderHist, { ...order, label: id, balance: p.data[i + 1].open }];
            }
          }
        }
      };

      eval(script);
    } catch (err) {
      appendLog(`Script encountered error: ${err}`);
    }
  }

  let losses = [0];
  let gains = [0];
  const numTrades = orderHist.length;

  for (let i = 1; i < numTrades; i += 1) {
    const thisTrade = orderHist[i].balance;
    const lastTrade = orderHist[i - 1].balance;
    const tradeDiff = thisTrade + lastTrade;

    // console.log('tradeDiff', tradeDiff)
    // console.log('thisTrade', thisTrade)
    // console.log('lastTrade', lastTrade)
    // for every sell
    if (thisTrade > 0) {
      if (tradeDiff > 0) { // gain
        gains = [...gains, tradeDiff];
        orderHist[i] = { ...orderHist[i], loss: false };
      } else if (tradeDiff < 0) { // loss
        losses = [...losses, tradeDiff];
        orderHist[i] = { ...orderHist[i], loss: true };
      }
    }
  }

  const avgLoss = round(losses.reduce((a, b) => (a + b), 0) / losses.length, 2);
  const avgGain = round(gains.reduce((a, b) => (a + b), 0) / losses.length, 2);
  const total = round(losses.reduce((a, b) => (a + b), 0) + gains.reduce((a, b) => (a + b), 0), 2);
  const range = (p.data[p.data.length - 1].time - p.data[0].time) / 1000;

  const result = {
    avgLoss,
    avgGain,
    avgTrade: round(avgGain + avgLoss, 2),
    numTrades,
    total,
    rate: (total / range), // dollars per second per coin
    data: orderHist,
  };

  appendLog(`Avg. gain: ${avgGain} Avg. loss: ${avgLoss} Diff: ${round(avgGain + avgLoss, 2)} Total: ${total}`);
  return result;
};

export default test;
