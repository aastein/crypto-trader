import React, { Component } from 'react'
import ReactHighstock from 'react-highcharts/ReactHighstock.src'
//import Highlight from 'react-highlight'
import { tryGetHistoricalData } from '../utils/api'

export default class Chart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      btc: {
        product: 'BTC-USD',
        start: '2016-06-29T20:08:43.347Z',
        end: '2017-06-29T20:15:15.175Z'
      }
    }
  }

  componentDidMount(){
    let product = this.state.btc.product
    let start = this.state.btc.start
    let end = this.state.btc.end
    tryGetHistoricalData(product, start, end).then((data) => {
      this.setState((prevState) => {
        let n = {
          ...prevState.btc,
          data: data[0].sort((a, b) => {
            if(a.time < b.time) return -1;
            if(a.time > b.time) return 1;
            return 0;
          })
        }
        return { btc: n }
      })
    })
  }

  render() {

    let config = {
     rangeSelector: {
       selected: 1
     },
     title: {
       text: 'AAPL Stock Price'
     },
     series: [{
       name: 'AAPL',
       data: !this.state.btc.data ? [] : this.state.btc.data.map(d => (
         [
           d.open,
           d.high,
           d.low,
           d.close
         ]
       )),
       type: 'candlestick',
       tooltip: {
         valueDecimals: 2
       }
     }]
    }

    return (
       <div>
         { this.state.btc.data ?
         <ReactHighstock config={config} /> :
          <div>
            Loading
          </div>
        }
       </div>
      )
    }
  }
