import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts/ReactHighstock.src'


export default class PriceChart extends Component {
  render() {
    return (
      <div className='line-chart chart' >
        <ReactHighcharts config={this.props.config} />
      </div>
    )
  }
}
