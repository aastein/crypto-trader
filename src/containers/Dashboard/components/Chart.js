import React, { Component } from 'react'

import { Loader } from '../../../components/Loader'
import PriceChart from '../../../components/PriceChart'
import LineChart from '../../../components/LineChart'


export default class Chart extends Component {

  render() {

    let selectedProduct = this.props.chart.products.length > 0 ?  this.props.chart.products.reduce((a, p) => {
      return a = p.active ? p : a
     }, {}) : {}

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

    let selectedProductIndicatorMetaKData = selectedProduct.metasrsi ? selectedProduct.metasrsi.map(d => {
      return [ d.time, d.k ]
    }) : []

    let selectedProductIndicatorMetaDData = selectedProduct.metasrsi ? selectedProduct.metasrsi.map(d => {
      return [ d.time, d.d ]
    }) : []

    let selectedProductRSIData = selectedProduct.rsi ? selectedProduct.rsi.map(d => {
      return [ d.time, d.value ]
    }) : []

    let selectedProductCCIData = selectedProduct.cci ? selectedProduct.cci.map(d => {
      return [ d.time, d.value ]
    }) : []

    let selectedProductWSPriceData = selectedProduct.ws_data ?selectedProduct.ws_data.map(d => (
      [ d.time, d.price ]
    )) : []

    let selectedProductWSVolumeData = selectedProduct.ws_data ? selectedProduct.ws_data.map(d => (
      [ d.time, d.size ]
    )) : []

    /*
    [{
      color: 'red',
      value: 1499744484000,
      width: 2
    }]
    */
    let testPlotLines = this.props.chart.testResult.data ? this.props.chart.testResult.data.map( d => (
      {
        id: 'testResult',
        value: d.time,
        width: 2,
        color: d.balance < 0 ? 'green' : 'red',
        dashStyle: d.loss ? 'dot' : 'solid',
        label: {
          text: d.label,
          verticalAlign: 'top',
          textAlign: 'left',
          rotation: 0
        }
      }
    )) : []

    let config = {
      chart: {
        marginBottom: 15
      },
      navigator: {
        height: 10
      },
      rangeSelector: {
        enabled: false
      },
      xAxis: {
        plotLines: testPlotLines
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
        top: '40%',
        height: '20%',
        offset: 0,
        lineWidth: 2
      },
      {
        labels: {
          align: 'right',
          x: -3
        },
        top: '62%',
        height: '17%',
        lineWidth: 2,
        max: 1,
        min: 0,
        plotLines: [{
          value: .8,
          color: 'red',
          width: 1
        }, {
          value: .2,
          color: 'red',
          width: 1
        }]
      },
      {
        labels: {
          align: 'right',
          x: -3
        },
        top: '80%',
        height: '10%',
        lineWidth: 2,
        softMax: 100,
        softMin: 0,
        plotLines: [{
          value: 70,
          color: 'red',
          width: 1
        }, {
          value: 30,
          color: 'red',
          width: 1
        }]
      },
      {
        labels: {
          align: 'right',
          x: -3
        },
        top: '90%',
        height: '10%',
        lineWidth: 2,
        max: 400,
        min: -400,
        plotLines: [{
          value: 100,
          color: 'red',
          width: 1
        }, {
          value: -100,
          color: 'red',
          width: 1
        }]
      }],
      series: [{
        name: selectedProduct.display_name,
        data: selectedProductPriceData,
        type: 'candlestick',
        tooltip: {
          valueDecimals: 2
        },
        dataGrouping: {
            enabled: false
        }
      },
      {
        type: 'column',
        name: 'Volume',
        dataGrouping: {
            enabled: false
        },
        data: selectedProductVolumeData,
        yAxis: 1
      },
      {
        data: selectedProductIndicatorKData,
        type: 'line',
        name: 'k',
        tooltip: {
          valueDecimals: 2
        },
        yAxis: 2,
        dataGrouping: {
          enabled: false
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1
          }
        }
      },
      {
        data: selectedProductIndicatorDData,
        type: 'line',
        name: 'd',
        tooltip: {
          valueDecimals: 2
        },
        yAxis: 2,
        lineWidth: 1,
        dataGrouping: {
          enabled: false
        },
        states: {
          hover: {
            lineWidth: 1
          }
        }
      },
      {
        data: selectedProductIndicatorMetaKData,
        type: 'line',
        name: 'metaK',
        tooltip: {
          valueDecimals: 2
        },
        yAxis: 2,
        lineWidth: 1,
        dataGrouping: {
          enabled: false
        },
        states: {
          hover: {
            lineWidth: 1
          }
        }
      },
      {
        data: selectedProductIndicatorMetaDData,
        type: 'line',
        name: 'metaD',
        tooltip: {
          valueDecimals: 2
        },
        yAxis: 2,
        lineWidth: 1,
        dataGrouping: {
          enabled: false
        },
        states: {
          hover: {
            lineWidth: 1
          }
        }
      },
      {
        data: selectedProductRSIData,
        type: 'line',
        name: 'rsi',
        tooltip: {
          valueDecimals: 2
        },
        yAxis: 3,
        dataGrouping: {
            enabled: false
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1
          }
        }
      },
      {
        data: selectedProductCCIData,
        type: 'line',
        name: 'cci',
        tooltip: {
          valueDecimals: 2
        },
        yAxis: 4,
        dataGrouping: {
            enabled: false
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1
          }
        }
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
        height: '114%',
        top: '-14%',
        lineWidth: 2
      },
      {
        labels: {
          align: 'right',
          x: -3
        },
        top: '85%',
        height: '15%',
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
      }
    }

    return (
       <div style={{width: 1030, height: 390}}>
         { selectedProduct.data && selectedProduct.data.length > 0 ?
           <div>
             <PriceChart
               config={config}
               chart={this.props.chart}
               scripts={this.props.scripts}
               profile={this.props.profile}
               appendLog={this.props.appendLog}
               updateAccounts={this.props.updateAccounts}
             />
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
