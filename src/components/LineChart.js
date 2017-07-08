import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts/ReactHighstock.src'


export default class PriceChart extends Component {

  dataChanged = (nextProps) => {
    for(let i = 0 ; i < nextProps.config.series.length; i++){
      if (this.props.config.series[i]) {
        // if start or last data is not equal to previous
        let lastIndex = this.props.config.series[i].data.length - 1
        let earliestDataChanged = JSON.stringify(this.props.config.series[i].data[0]) !== JSON.stringify(nextProps.config.series[i].data[0])
        let latestDataChanged = JSON.stringify(this.props.config.series[i].data[lastIndex]) !== JSON.stringify(nextProps.config.series[i].data[lastIndex])
        return earliestDataChanged || latestDataChanged
      }
    }
    return false
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    let rerender = this.dataChanged(nextProps)
    //console.log('ws chart re-rendering', rerender)
    return rerender
  }

  componentWillReceiveProps = (nextProps) => {
    let chart = this.refs.wschart.getChart();
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
      <div className='line-chart chart' >
        <ReactHighcharts config={this.props.config} ref="wschart"/>
      </div>
    )
  }
}
