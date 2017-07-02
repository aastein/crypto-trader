import React, { Component } from 'react'
import Chart from './Chart'
import Scratchpad from './Scratchpad'
const log = 'Logging goes here'

export default class Dashboard extends Component {

  render() {
    return (
      <div className='dashboard'>
        <div className='container dashboard-top'>
          <div className='col-md-8'>
            <Chart
              chart={this.props.chart}
              setProducts={this.props.setProducts}
              onSelect={this.props.onSelect}
              setProductData={this.props.setProductData}
              onApply={this.props.onApply}
            />
          </div>
          <div className='col-md-4'>
            {log}
          </div>
        </div>
        <div className='container dashboard-bottom'>
          <div className='col-md-12'>
            <Scratchpad
              scripts={this.props.scrips}
              onAdd={this.props.onAdd}
              onSave={this.props.onSave}
              onDelete={this.props.onDelete}
            />
          </div>
        </div>
      </div>
    )
  }
}
