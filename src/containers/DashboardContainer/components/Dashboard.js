import React, { Component } from 'react'
import ChartHeader  from './ChartHeader'
import Chart from './Chart'
import Scratchpad from './Scratchpad'
const log = 'Logging goes here'

export default class Dashboard extends Component {

  render() {
    return (
      <div className='dashboard'>
        <div className='container dashboard-top'>
          <div className='col-md-9'>
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
          <div className='col-md-3' style={{height: 435}}>
            { this.props.log.map( l => {
              return (
                l.message.split('\n').map((item, key) => {
                    return <span key={key}>{item}<br/></span>
                })
              )
            })}
          </div>
        </div>
        <div className='container dashboard-bottom'>
          <div className='col-md-12'>
            <Scratchpad
              scripts={this.props.scripts}
              products={this.props.chart.products}
              addScript={this.props.addScript}
              appendLog={this.props.appendLog}
              saveScript={this.props.saveScript}
              deleteScript={this.props.deleteScript}
              selectScript={this.props.selectScript}
              selectProductDoc={this.props.selectProductDoc}
            />
          </div>
        </div>
      </div>
    )
  }
}
