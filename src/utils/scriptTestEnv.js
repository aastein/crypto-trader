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

const test = (header, script, prods, appendLog) => {
  const scriptWithHeader = header + ';' + script;
  const log = appendLog;
  orderHist = [];
  products = prods;
  p = products.reduce((a, b) => (
    b.active ? b : a
  ), {});

  for (let i = 1; i < p.data.length - 1; i += 1) {
    const now = i;
    const lastOrder = orderHist.length > 0 ? orderHist[orderHist.length - 1] : {};
    const order = { time: p.data[i + 1].time, price: 0 };

    try {
      const buy = (id) => {
        if (orderHist.length === 0) {
          orderHist = [...orderHist, { ...order, label: id, price: (-1) * p.data[i + 1].open }];
        } else if (orderHist[orderHist.length - 1].price > 0) {
          orderHist = [...orderHist, { ...order, label: id, price: (-1) * p.data[i + 1].open }];
        }
      };

      const sell = (id) => {
        if (orderHist.length !== 0) {
          if (orderHist[orderHist.length - 1].price) {
            if (orderHist[orderHist.length - 1].price < 0) {
              orderHist = [...orderHist, { ...order, label: id, price: p.data[i + 1].open }];
            }
          }
        }
      };
      eval(scriptWithHeader);
    } catch (err) {
      appendLog(`Script encountered error: ${err}`);
    }
  }

  let losses = [0];
  let gains = [0];
  const numTrades = orderHist.length;

  for (let i = 1; i < numTrades; i += 1) {
    const thisTrade = orderHist[i].price;
    const lastTrade = orderHist[i - 1].price;
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
  const rate = round((total / range) * 3600, 2);
  const result = {
    avgLoss,
    avgGain,
    avgTrade: round(avgGain + avgLoss, 2),
    numTrades,
    total,
    rate, // dollars per hour per coin
    data: orderHist,
  };

  appendLog(`Test Results:
    Gain: ${avgGain} [ %/trade ]
    Loss: ${avgLoss} [ %/trade ]
    Rate: ${rate} [ $/hr/coin ]
    Total Gain: ${total} [ $ ]`,
  );
  return result;
};

export default test;
