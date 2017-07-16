# crypto-trader

Stand alone client side automated trading for GDAX
</br>
</br>
WIP @ <a target="_blank" href="https://crypto-trader-2b0ce.firebaseapp.com">fireabase</a>


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

Write conditions based on the data to execute all in / all out limit orders
```
if(p.rsi[now].value < 70){
  sell()
} else if(p.rsi[now].value > 30){
  buy()
}
```

Print to the log with log()
```
log('First RSI is' + p.rsi[0].value)
```

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
