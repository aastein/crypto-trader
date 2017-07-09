# crypto-trader

Stand alone client side automated trading for GDAX
</br>
</br>
WIP @ https://crypto-trader-2b0ce.firebaseapp.com


## Usage

Write scripts to trigger trades on GDAX

Click on the Product Data list item to see avalable data for the product 
```
BTC_USD.data[0].close
```

Write conditions based on the data to execute limit orders 

```
if(BTC_USD.rsi[lastIndex].value > 70){
  limitOrder('sell', 'BTC-USD')
}
```

Print to the log with log()

```
log('RSI is' + BTC_USD.rsi[0].value)
```

Reserved variables

```
product
profile
log
script
prods
prof
appendLog
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
