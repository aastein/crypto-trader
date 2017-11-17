[![CircleCI](https://circleci.com/gh/aastein/crypto-trader/tree/master.svg?style=svg&circle-token=ed13989cea476fd5f00e9e3abaa47c6bcc563c6f)](https://circleci.com/gh/aastein/crypto-trader/tree/master)

# crypto-trader

Stand alone client side automated trading for GDAX
</br>
</br>
WIP @ <a target="_blank" href="https://aaronste.in">aaronste.in</a>


## Getting Started

### Chrome on OSX

Go to the profile page and upload browser data.
<img src="/public/osx-chrome-setup.png" width="1000">

### Other OS and Browser

Login to GDAX
Open the browser console and navigate to the settings page

<img src="/public/step1.png" height="200">

Find the GET request for /profiles

<img src="/public/step2.png" width="450">

Copy the cb-session in the request headers

<img src="/public/step3.png" width="500">

Go to the profile page on crypto-trader and paste in the cb-session to the session input and click save

<img src="/public/step4.png" width="450">

Because this is app isn't backed by any server, before ending a session you can export your current config. Before starting a new session you can upload the config to start where you left off.
<img src="/public/importexport.png" width="400">

## General features

- Custom scripts
- Order execution
- Backtesting
- Global live mode to prevent accidental trades
- Script level live mode
- Manual script execution
- Automatic script execution when new data is added to the main chart
- Subscribes to GDAX web socket feed for new data

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
  log('First order you sold stuff')
} else if(orders[0] < 0){
  log('First order you bought stuff')
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
### Orders

Orders are made with the <a href="https://docs.gdax.com/#time-in-force">GTT</a> flag set to `min`
After one minute if the order has not been fully filled the triggering script will re-run. To take advantage of the retry logic it is best to write buy and sell conditions in a way that will be valid for a range in time, not a single instant.

Bad
```
if(p.rsi[now].value === 70){
  sell()
} else if(p.rsi[now].value === 30){
  buy()
}
```

Better
```
if(p.rsi[now].value < 70){
  sell()
} else if(p.rsi[now].value > 30){
  buy()
}
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



### Reserved viable names
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
config
```

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
