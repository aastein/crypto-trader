# crypto-trader

Stand alone client side automated trading for GDAX
</br>
</br>
WIP @ <a target="_blank" href="https://crypto-trader-2b0ce.firebaseapp.com">firebase</a>


## Usage

Write scripts to trigger trades on GDAX

Click on the Product Data list item to see available data for the product

Reference the selected product on the chart with `p`
```
p.data[0].close
```

Use `now` when you want to reference the current data
```
p.data[now].close
```

Write conditions based on the data to execute all in / all out <a href="https://docs.gdax.com/#post-only">post-only</a> limit orders with
```
if(p.rsi[now].value < 70){
  sell()
} else if(p.rsi[now].value > 30){
  buy()
}
```

Access order history for the current product with `orders`. Order history is recorded by strike price. If the order is a buy the price is negative. If the order is a sell the price is positive.
```
if(orders[0] > 0){
  log('Last order you sold stuff')
} else if(orders[0] < 0){
  log('Last order you bought stuff')
}
```

Use `lastOrder` to access the last order data
```
log(lastOrder)
//  {"id":"BTC-USD","time":"2016-12-08T20:02:28.53864Z","price":-2000}
```

Print to the log with log()
```
log('First RSI is ' + p.rsi[0].value)
// 12:21:00 am: First RSI is 0.70
```

### Testing your scripts

Write scripts using the `now` array index when accessing current data.
Pass in custom id's to the buy() and sell() methods to label the plot lines.
```
if(rebound){
  buy('reboud')
} else if(kOverBuy){
  buy('kOverBuy')
}else if (lastKOverD){
  sell('lastKOverD')
} else if(!nowKOverD) {
  sell('!nowKOverD')
}
```
<img src="/public/chart.png" width="450">
Red lines represent sells.
Red dotted lines represent sells for a loss.
Green lines represent buys.



Reserved viable names
```
product
profile
log
script
prods
prof
appendLog
now
buy
sell
lastOrder
orders
```

## Getting Started

Login to GDAX
Open the browser console and navigate to the settings page

<img src="/public/step1.png" height="300">

Find the GET request for /profiles

<img src="/public/step2.png" width="450">

Copy the cb-session in the request headers

<img src="/public/step3.png" width="500">

Go to the profile page on crypto-trader and paste in the cb-session to the session input and click save

<img src="/public/step4.png" width="450">

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
