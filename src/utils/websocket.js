import moment from 'moment'

let connection

export const initWSConnection = (productList, addWSData, updateHeartbeat) => {

  let url = 'wss://ws-feed.gdax.com'
  connection = new WebSocket(url)

  console.log('Opening connection to ', url)

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
  connection.onmessage = event => {
    let data = JSON.parse(event.data)

    if(data.type === 'match'){
      console.log(data.type)
      updateHeartbeat(data.time, true)
    }

    if(data.type === 'match' || (data.type === 'done' &&  data.reason === 'filled')){
      let price = parseFloat(data.price)
      let time = moment(data.time).valueOf()
      let size = parseFloat(data.size)
      let product = data.product_id

      //console.log(data)
      //console.log('product: ', product, 'price: ', price,'time: ', time)

      if(price && time && size && product){
        if (typeof addWSData === "function") {
          addWSData(product, [{
            time : time,
            price: price,
            size: size
          }])
        }
      }
    }
  }

  waitForConnected(productList)
}


let waitForConnected = (productList) => {
  let n = 0
  let t = setInterval(() => {
    if(connection.readyState === 1){
      clearInterval(t);
      subscribe(productList)
      //hearbeat()
    }
    n++
    if(n > 4) {
      clearInterval(t);
      connection.close()
      connection = null
      initWSConnection(productList)
    }
  }, 1000);
}

/*
  produstList: array of product.id
  "product_ids": [
      "BTC-USD",
      "ETH-USD",
      "ETH-BTC"
  ]
*/
let subscribe = productList => {
  //console.log('subscribing to: ', productList)
//  productList = ['BTC-USD']
  connection.send(JSON.stringify(
    {
      "type": "subscribe",
      "product_ids": productList
    }
  ))
  console.log('subscribed')
}
