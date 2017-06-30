import React, { Component } from 'react'
import ReactHighstock from 'react-highcharts/ReactHighstock.src'
import moment from 'moment'

//import Highlight from 'react-highlight'
import { Loader } from './Loader'
import { Datepicker } from './Datepicker'
import { tryGetHistoricalData } from '../utils/api'


export default class Chart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      btc: {
        product: 'BTC-USD',
        startDate: '2017-05-29T20:08:43.347Z',
        endDate: '2017-06-29T20:15:15.175Z'
      },
      datePicker: {
        focusedInput: null,
        startDate: '2017-05-29T20:08:43.347Z',
        endDate: '2017-06-29T20:15:15.175Z'
      }
    }
  }

  fetchData = () => {

    let product = this.state.btc.product
    let startDate = this.state.btc.startDate
    let endDate = this.state.btc.endDate

    console.log('fetchData: ', startDate, endDate)
    tryGetHistoricalData(product, startDate, endDate).then((data) => {
      this.setState((prevState) => {
        let currencyData = {
          ...prevState.btc,
          data: data[0].sort((a, b) => {
            if(a.time < b.time) return -1;
            if(a.time > b.time) return 1;
            return 0;
          })
        }
        return { btc: currencyData }
      })
    })
  }

  componentDidMount(){
    this.fetchData()
  }

  onFocusChange = (focusedInput) => {
    focusedInput = focusedInput.focusedInput
    this.setState((prevState) => {
      let datePicker = { ...prevState.datePicker, focusedInput }
      return { datePicker }
    })
  }

  onDatesChange = ({ startDate, endDate }) => {
    this.setState((prevState) => {
      startDate = startDate ? startDate.toISOString() : null
      endDate = endDate ? endDate.toISOString() : startDate
      let datePicker = { ...prevState.datePicker, startDate, endDate }
      return { datePicker }
    })
  }

  onApply = (event) => {
    event.preventDefault()
    this.setState((prevState) => {
      let startDate = prevState.datePicker.startDate
      let endDate = prevState.datePicker.endDate
      let btc = { ...prevState.btc, startDate, endDate}
      return { btc }
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
       <div style={{width: 897,height: 470}}>
         <div className='date-picker'>
           <Datepicker
              startDate={moment(this.state.datePicker.startDate)}
              endDate={moment(this.state.datePicker.endDate)}
              focusedInput={this.state.datePicker.focusedInput}
              onFocusChange={this.onFocusChange}
              onDatesChange={this.onDatesChange}
              onApply={this.onApply}
            />
         </div>
         { this.state.btc.data ?
          <ReactHighstock config={config} />
         :<div>
            <Loader />
          </div>
        }
       </div>
      )
    }
  }
