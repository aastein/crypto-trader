import React, { Component } from 'react'
import ReactHighstock from 'react-highcharts/ReactHighstock.src'


export default class PriceChart extends Component {

  dataChanged = (nextProps) => {
    let dataChanged = this.props.config.series[0].name !== nextProps.config.series[0].name
      || this.props.config.series[0].data.length !== nextProps.config.series[0].data.length
    return dataChanged
  }

  shouldComponentUpdate = (nextProps, nextState) => (
    this.props.config.series[0].name !== nextProps.config.series[0].name
  )

  componentWillReceiveProps = (nextProps) => {
    let chart = this.refs.chart.getChart();
    if (this.dataChanged(nextProps)) {
      for(let i = 0 ; i < chart.series.length; i++){
        if(nextProps.config.series[i]){
            chart.series[i].setData(nextProps.config.series[i].data)
        }
      }
    }
  }

  render() {
    return (
      <div className='price-chart chart'>
        <ReactHighstock config={this.props.config} ref="chart"/>
      </div>
    )
  }
}
