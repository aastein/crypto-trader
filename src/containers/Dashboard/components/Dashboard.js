import React, { Component } from 'react'
import moment from 'moment'

import ChartHeader  from './ChartHeader'
import Chart from './Chart'
import Scratchpad from './Scratchpad'

export default class Dashboard extends Component {

  render() {
    return (
      <div className='dashboard'>
        <div className='container dashboard-top'>
          <div className='col-md-9'>
            <ChartHeader
              chart={this.props.chart}
              selectedProductIds={this.props.profile.selectedProducts.map( p => ( p.value ))}

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
          <div className='log col-md-3' style={{height: 400}}>
            <h2>
              History
            </h2>
            <div className='log-messages'>
              { this.props.log.map( l => {
                return (
                  <span className='log-message' key={l.time}>{`${moment(l.time).format('h:mm:ss a')}: ${l.message}`}</span>
                )
              })}
            </div>
          </div>
        </div>
        <div className='container dashboard-bottom'>
          <div className='col-md-12'>
            <Scratchpad
              scripts={this.props.scripts}
              products={this.props.chart.products}
              profile={this.props.profile}

              addScript={this.props.addScript}
              appendLog={this.props.appendLog}
              saveScript={this.props.saveScript}
              deleteScript={this.props.deleteScript}
              selectScript={this.props.selectScript}
              selectProductDoc={this.props.selectProductDoc}
              updateAccounts={this.props.updateAccounts}
            />
          </div>
        </div>
      </div>
    )
  }
}
