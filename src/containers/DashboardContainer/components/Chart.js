import React, { Component } from 'react'

import { Loader } from '../../../components/Loader'
import PriceChart from '../../../components/PriceChart'
import LineChart from '../../../components/LineChart'


export default class Chart extends Component {

  render() {

    let selectedProduct = this.props.chart.products.length > 0 ?  this.props.chart.products.reduce((a, p) => {
      return a = p.active ? p : a
     }, {}) : {}

    let dateRange = { startDate: this.props.chart.startDate, endDate: this.props.chart.endDate }

    let selectedProductPriceData = selectedProduct.data ? selectedProduct.data.map(d => (
      [ d.time, d.open, d.high, d.low, d.close ]
    )) : []

    let selectedProductVolumeData = selectedProduct.data ? selectedProduct.data.map(d => (
      [ d.time, d.volume ]
    )) : []

    let selectedProductIndicatorKData = selectedProduct.srsi ? selectedProduct.srsi.map(d => {
      return [ d.time, d.k ]
    }) : []

    let selectedProductIndicatorDData = selectedProduct.srsi ? selectedProduct.srsi.map(d => {
      return [ d.time, d.d ]
    }) : []

    let selectedProductWSPriceData = selectedProduct.ws_data ?selectedProduct.ws_data.map(d => (
      [ d.time, d.price ]
    )) : []

    let selectedProductWSVolumeData = selectedProduct.ws_data ? selectedProduct.ws_data.map(d => (
      [ d.time, d.size ]
    )) : []

    let config = {
      rangeSelector: {
        selected: 1,
        inputEnabled: false,
        buttonTheme: {
          visibility: 'hidden'
        },
        labelStyle: {
          visibility: 'hidden'
        }
      },
      yAxis: [{
      labels: {
        align: 'right',
        x: -3
      },
      height: '60%',
      lineWidth: 2
      },
      {
        labels: {
          align: 'right',
          x: -3
        },
        top: '60%',
        height: '20%',
        lineWidth: 2
      },
      {
        labels: {
          align: 'right',
          x: -3
        },
        top: '83%',
        height: '18%',
        offset: 0,
        lineWidth: 2
       }],
      series: [{
        name: selectedProduct.display_name,
        data: selectedProductPriceData,
        type: 'candlestick',
        tooltip: {
          valueDecimals: 2
        }
      },
      {
        data: selectedProductIndicatorKData,
        type: 'line',
        name: 'k',
        tooltip: {
          valueDecimals: 2
        },
        yAxis: 1
      },
      {
        data: selectedProductIndicatorDData,
        type: 'line',
        name: 'd',
        tooltip: {
          valueDecimals: 2
        },
        yAxis: 1
      },
      {
        type: 'column',
        name: 'Volume',
        data: selectedProductVolumeData,
        yAxis: 2
      }],
      scrollbar: {
        enabled: false
      },
      pane: {
        background: {
          borderWidth: 0
        }
      }
    }

    let wsConfig = {
      yAxis: [{
           labels: {
               align: 'right',
               x: -3
           },
           top: '-12%',
           height: '100%',
           lineWidth: 2
       }, {
           labels: {
               align: 'right',
               x: -3
           },
           top: '83%',
           height: '18%',
           offset: 0,
           lineWidth: 2
       }],
      series: [{
        data: selectedProductWSPriceData,
        type: 'line',
        name: 'Price',
        tooltip: {
          valueDecimals: 2
        }
      },
      {
        type: 'column',
        name: 'Size',
        data: selectedProductWSVolumeData,
        yAxis: 1,
      }],
      navigator: {
        enabled: false
      },
      scrollbar: {
        enabled: false
      },
      pane: {
        background: {
          borderWidth: 0
        }
      },
      chart: {
        height: '129%'
      }
    }

    return (
       <div style={{width: 950,height: 400}}>
         { selectedProduct.data && selectedProduct.data.length > 0 ?
           <div>
             <PriceChart dateRange={dateRange} config={config} />
             <LineChart config={wsConfig} />
           </div>
         :<div>
            <Loader />
          </div>
        }
       </div>
      )
    }
  }
