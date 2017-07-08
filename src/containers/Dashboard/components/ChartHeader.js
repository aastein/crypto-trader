import React, { Component } from 'react'
import moment from 'moment'

import Datepicker from '../../../components/Datepicker'
import { Dropdown } from '../../../components/Dropdown'
import { Input } from '../../../components/Input'
import { serverTime, tryGetHistoricalData, getProducts } from '../../../utils/api'
import { initWSConnection } from '../../../utils/websocket'

export default class Chart extends Component {

  componentDidMount(){
    this.initData()
  }

  initData = () => {
    if(this.props.chart.products.length === 0){
      getProducts().then(products => {
        let productIds = products.map( p => (p.id))
        this.props.setProducts(products)
        this.props.selectProduct('BTC-USD')
        initWSConnection(productIds, this.props.setProductWSData)
        for (const product of products) {
          this.fetchProductData(product.id, 60, 60)
        }
      })
    }
  }

  fetchProductData = (id, range, granularity) => {
  //  if(id === 'BTC-USD'){
      serverTime().then( time => {
        tryGetHistoricalData(id, time, range, granularity).then( data => {
          this.props.setProductData(id, data)
        }).catch((err) => {alert(err)})
      })
  //  }
  }

  onProductChange = (event) => {
    if (event) {
      this.props.selectProduct(event.value)
    }
  }

  onSelectIndicator = (event) => {
    if (event) {
      this.props.selectIndicator(event.value)
    }
  }

  onSelectDateRange = (event) => {
    let id = this.props.chart.products.reduce((a, p) => (
      a = p.active ? p.id : a
    ), '')
    if (event) {
      this.props.selectDateRange(id, event.value)
    }
  }

  onSetGanularity = (name, event) => {
    let id = this.props.chart.products.reduce((a, p) => (
      a = p.active ? p.id : a
    ), '')
    this.props.setGanularity(id, event.target.value)
  }

  onApply = (startDate, endDate) => {
    let product = this.props.chart.products.reduce((a, p) => (
      a = p.active ? p : a
    ), {})
     this.fetchProductData(product.id, product.range, product.granularity)
   }

  render() {

    let selectedProduct = this.props.chart.products.length > 0 ?  this.props.chart.products.reduce((a, p) => (
      a = p.active ? p : a
    ), {}) : {}

    let dropdownProductOptions = this.props.chart.products.map(product => {
      return { value: product.id, label: product.display_name}
    }).filter( p => (
      this.props.selectedProductIds.indexOf(p.value) > -1
    ))

    let dropdownIndicatorOptions = this.props.indicators.map(indicator => {
      return { value: indicator.id, label: indicator.id}
    })

    let activeIndicator = this.props.indicators.reduce((a, b) => (
       a = b.active ? b : a
    ), {})

    return (
       <div className='chart-header' style={{width: 950, height: 35}}>
         <div className='product-dropdown chart-header-item'>
           <Dropdown
            options={dropdownProductOptions}
            onChange={this.onProductChange}
            value={selectedProduct.id}
          />
         </div>
         <div className='indicator-dropdown chart-header-item'>
           <Dropdown
            options={dropdownIndicatorOptions}
            onChange={this.onSelectIndicator}
            value={activeIndicator.id}
          />
         </div>
         <div className='date-picker chart-header-item'>
            <Dropdown
              options={this.props.chart.dateRanges}
              onChange={this.onSelectDateRange}
              value={selectedProduct.range}
            />
         </div>
         <div className='granularity chart-header-item'>
           <Input name='granularity' onChange={this.onSetGanularity} placeholder='' value={selectedProduct.granularity ? selectedProduct.granularity + '' : ''} />
         </div>
         <div className='granularity-label'>
           <label>s</label>
         </div>
         <button className="chart-header-item btn btn-primary" onClick={this.onApply}>Apply</button>
       </div>
      )
    }
  }
