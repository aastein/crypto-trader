import React, { Component } from 'react'
import ReactHighstock from 'react-highcharts/ReactHighstock.src'
//import Highlight from 'react-highlight'
import { Loader } from './Loader'
import { tryGetHistoricalData } from '../utils/api'
// 1498700000
// 1277942400000
export default class Chart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      btc: {
        product: 'BTC-USD',
        start: '2017-05-29T20:08:43.347Z',
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
       text: this.state.btc.product
     },
     series: [{
       name: this.state.btc.product,
       data: !this.state.btc.data ? [] : this.state.btc.data.map(d => (
         [
           d.time,
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
          <div style={{width: 897,height: 400}}>
            <Loader />
          </div>
        }
       </div>
      )
    }
  }
