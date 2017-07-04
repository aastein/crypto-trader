import React, { Component } from 'react'

import { Loader } from '../../../components/Loader'
import PriceChart from '../../../components/PriceChart'
import LineChart from '../../../components/LineChart'
import { tryGetHistoricalData, getProducts } from '../../../utils/api'
import { initWSConnection } from '../../../utils/websocket'

export default class Chart extends Component {

  constructor(props){
    super(props)
    this.state = { isFetching : false }
  }

  componentDidMount(){
    this.initData()
  }

  initData = () => {
    if(!this.props.chart.productId){
      getProducts().then(products => {
        this.props.setProducts(products)
        let startDate = this.props.chart.startDate
        let endDate = this.props.chart.endDate
        let initalProduct = products.filter( p => (
          p.id === 'BTC-USD'
        ))[0]
        this.props.onSelect(initalProduct.id)
        let productIds = products.map( p => (
          p.id
        ))
        //initWSConnection(productIds, this.props.setProductWSData)
        for (const product of products) {
          this.fetchProductData(product.id, startDate, endDate, 3600000)
        }
      })
    }
  }

  fetchProductData = (productId, startDate, endDate, granularity) => {
    //if(productId === 'BTC-USD'){
      tryGetHistoricalData(productId, startDate, endDate, granularity).then((data) => {
        this.props.setProductData(productId, data)
        this.props.onApply(startDate, endDate)
        this.setState(() => (
          { isFetching: false }
        ))
      })
  //  }
  }

  selectedProduct = () => (
    this.props.chart.products.length > 0 && this.props.chart.productId ?  this.props.chart.products.filter( product => (
     product.id === this.props.chart.productId
   ))[0] : ''
  )

  render() {

    let dateRange = { startDate: this.props.chart.startDate, endDate: this.props.chart.endDate }

    let selectedProductHasData = this.props.chart.products.length > 0 ? this.props.chart.products.filter( product => {
      return product.id === this.props.chart.productId && product.data
    }).length > 0 : false


    let selectedProductData = this.selectedProduct().data ? this.selectedProduct().data.map(d => (
      [ d.time, d.open, d.high, d.low, d.close ]
    )) : []

    let selectedProductWSData = this.selectedProduct().ws_data ? this.selectedProduct().ws_data.map(d => (
      [ d.time, d.price ]
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
      series: [{
        name: this.selectedProduct().display_name,
        data: selectedProductData,
        type: 'candlestick',
        tooltip: {
          valueDecimals: 2
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
      series: [{
        data: selectedProductWSData,
        type: 'line',
        tooltip: {
          valueDecimals: 2
        }
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
         { selectedProductHasData ?
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
