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
              onSelect={this.props.onSelect}
              onApply={this.props.onApply}
              onSetGanularity={this.props.onSetGanularity}
              setProductData={this.props.setProductData}
            />
            <Chart
              chart={this.props.chart}
              onSelect={this.props.onSelect}
              onApply={this.props.onApply}
              setProducts={this.props.setProducts}
              setProductData={this.props.setProductData}
              setProductWSData={this.props.setProductWSData}
            />
          </div>
          <div className='col-md-4'>
            {log}
          </div>
        </div>
        <div className='container dashboard-bottom'>
          <div className='col-md-12'>
            <Scratchpad
              scripts={this.props.scripts}
              docs={this.props.docs}
              onAdd={this.props.onAdd}
              onSave={this.props.onSave}
              onDelete={this.props.onDelete}
              onScriptClick={this.props.onScriptClick}
              onDocClick={this.props.onDocClick}
              products={this.props.chart.products}
            />
          </div>
        </div>
      </div>
    )
  }
}
