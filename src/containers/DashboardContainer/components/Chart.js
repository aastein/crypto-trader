import React, { Component } from 'react'

import Datepicker from './Datepicker'
import { Dropdown } from './Dropdown'
import { Loader } from '../../../components/Loader'
import { tryGetHistoricalData, getProducts } from '../../../utils/api'
import PriceChart from './PriceChart'


export default class Chart extends Component {

  constructor(props){
    super(props)
    this.state = { isFetching : false }
  }

  componentDidMount(){
    this.initData()
  }

  initData = () => {
    if(!this.props.chart.product){
      getProducts().then(products => {
        this.props.setProducts(products)
        let product = products[0].id
        let startDate = this.props.chart.startDate
        let endDate = this.props.chart.endDate
        this.fetchProductData(product, startDate, endDate)
      })
    }  
  }

  fetchProductData = (product, startDate, endDate) => {
    tryGetHistoricalData(product, startDate, endDate).then((data) => {
      this.props.setProductData(product, data)
      this.props.onApply(startDate, endDate)
      if(!this.props.product) this.props.onSelect(product)
      this.setState(() => (
        { isFetching: false }
      ))
    })
  }

  onApply = (startDate, endDate) => {
    this.setState(() => (
      { isFetching: true }
    ))
    this.fetchProductData(this.props.chart.product, startDate, endDate)
  }

  onChange = (event) => {
    if (event.value) {
      this.props.onSelect(event.value)
      this.fetchProductData(event.value, this.props.chart.startDate, this.props.chart.endDate)
    }
  }

  render() {

    let dateRange = { startDate: this.props.chart.startDate, endDate: this.props.chart.endDate }

    let selectedProductHasData = this.props.chart.products.length > 0 ? this.props.chart.products.filter( product => {
      return product.id === this.props.chart.product && product.data
    }).length > 0 : false

    let selectedProduct = this.props.chart.products.length > 0 && this.props.chart.product ?  this.props.chart.products.filter( product => (
      product.id === this.props.chart.product
    ))[0] : ''

    let selectedProductData = selectedProduct.data ? selectedProduct.data.map(d => (
      [ d.time, d.open, d.high, d.low, d.close ]
    )) : []

    let config = {
     rangeSelector: {
       selected: 1
     },
     title: {
       text: selectedProduct.display_name
     },
     series: [{
       name: selectedProduct.display_name,
       data: selectedProductData,
        type: 'candlestick',
        tooltip: {
         valueDecimals: 2
        }
     }]
    }

    let dropdownOptions = this.props.chart.products.map(product => {
      return { value: product.id, label: product.display_name}
    })

    return (
       <div style={{width: 897,height: 420}}>
         <div className='dropdown'>
           <Dropdown
            options={dropdownOptions}
            onChange={this.onChange}
            value={this.props.chart.product}
          />
         </div>
         <div className='date-picker'>
           <Datepicker
              startDate={this.props.chart.startDate}
              endDate={this.props.chart.endDate}
              onApply={this.onApply}
              isFetching={this.state.isFetching}
            />
         </div>
         { selectedProductHasData ?
          <PriceChart dateRange={dateRange} config={config} />
         :<div>
            <Loader />
          </div>
        }
       </div>
      )
    }
  }
