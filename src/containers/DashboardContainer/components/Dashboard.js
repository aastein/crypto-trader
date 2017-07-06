import React, { Component } from 'react'
import ChartHeader  from './ChartHeader'
import Chart from './Chart'
import Scratchpad from './Scratchpad'
const log = 'Logging goes here'

export default class Dashboard extends Component {

  render() {
    if (!this.props.docs) this.props.initDocs()
    return (
      <div className='dashboard'>
        <div className='container dashboard-top'>
          <div className='col-md-8'>
            <ChartHeader
              chart={this.props.chart}
              indicators={this.props.indicators}
              selectProduct={this.props.selectProduct}
              setGanularity={this.props.setGranularity}
              setProductData={this.props.setProductData}
              selectIndicator={this.props.selectIndicator}
              editIndicator={this.props.editIndicator}
              selectDateRange={this.props.selectDateRange}
              setProducts={this.props.setProducts}
              setProductWSData={this.props.setProductWSData}
            />
            <Chart
              chart={this.props.chart}
            />
          </div>
          <div className='col-md-4'>
            {log}
          </div>
        </div>
        <div className='container dashboard-bottom'>
          <div className='col-md-12'>
            <Scratchpad
              docs={this.props.docs}
              scripts={this.props.scripts}
              products={this.props.chart.products}
              addScript={this.props.addScript}
              saveScript={this.props.saveScript}
              deleteScript={this.props.deleteScript}
              selectScript={this.props.selectScript}
              selectDoc={this.props.selectDoc}
            />
          </div>
        </div>
      </div>
    )
  }
}
