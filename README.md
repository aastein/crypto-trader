# crypto-trader

Stand alone client side automated trading for GDAX
</br>
</br>
WIP @ https://crypto-trader-2b0ce.firebaseapp.com

## Getting Started

Login to GDAX
Open the browser console and navigate to the settings page
</br>
</br>
<img src="/public/step1.png" height="300">
</br>
</br>
Find the GET request for /profiles
</br>
</br>
<img src="/public/step2.png" width="450">
</br>
</br>
Copy the cb-session in the request headers
</br>
</br>
<img src="/public/step3.png" width="500">
</br>
</br>
Go to the profile page on crypto-trader and paste in the cb-session to the session input and click save
</br>
</br>
<img src="/public/step4.png" width="450">

## Usage

Write scripts to trigger trades on GDAX
Click on the Product Data list item to see avalable data for the product 
```BTC_USD.data[0].close```
Write conditions based on the data to execute limit orders 
```
if(BTC_USD.rsi[lastIndex].value > 70){
  limitOrder('sell', 'BTC-USD')
}
```
