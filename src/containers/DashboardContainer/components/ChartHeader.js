import React, { Component } from 'react'

import Datepicker from '../../../components/Datepicker'
import { Dropdown } from '../../../components/Dropdown'
import { Input } from '../../../components/Input'
import { tryGetHistoricalData } from '../../../utils/api'

export default class Chart extends Component {

  constructor(props){
    super(props)
    this.state = { isFetching : false }
  }

  selectedProduct = () => (
    this.props.chart.products.length > 0 && this.props.chart.productId ?  this.props.chart.products.filter( product => (
     product.id === this.props.chart.productId
   ))[0] : ''
  )

  onApply = (startDate, endDate) => {
    this.setState(() => (
      { isFetching: true }
    ))
    this.fetchProductData(this.props.chart.productId, startDate, endDate, this.selectedProduct().granularity)
  }

  onProductChange = (event) => {
    if (event) {
      this.props.onSelect(event.value)
    }
  }

  onIndicatorChange = (event) => {
    if (event) {
      this.props.onSelectIndicator(event.value)
    }
  }

  onSetGanularity = (name, event) => {
    this.props.onSetGanularity(this.props.chart.productId, event.target.value)
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

  render() {

    let dropdownProductOptions = this.props.chart.products.map(product => {
      return { value: product.id, label: product.display_name}
    })

    let dropdownIndicatorOptions = this.props.indicators.map(indicator => {
      return { value: indicator.id, label: indicator.id}
    })

    let activeIndicator = this.props.indicators.filter(indicator => (
       indicator.active
    ))[0]

    return (
       <div style={{width: 950, height: 35}}>
         <div className='product-dropdown'>
           <Dropdown
            options={dropdownProductOptions}
            onChange={this.onProductChange}
            value={this.props.chart.productId}
          />
         </div>
         <div className='indicator-dropdown'>
           <Dropdown
            options={dropdownIndicatorOptions}
            onChange={this.onIndicatorChange}
            value={activeIndicator.id}
          />
         </div>
         <div className='granularity'>
          <Input name='granularity' onChange={this.onSetGanularity} placeholder='' value={this.selectedProduct().granularity ? this.selectedProduct().granularity + '' : ''} />
         </div>
         <div className='granularity-input'>
           <label>ms</label>
         </div>
         <div className='date-picker'>
           <Datepicker
              startDate={this.props.chart.startDate}
              endDate={this.props.chart.endDate}
              onApply={this.onApply}
              isFetching={this.state.isFetching}
            />
         </div>
       </div>
      )
    }
  }
