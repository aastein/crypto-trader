import React, { Component } from 'react'
import ReactHighstock from 'react-highcharts/ReactHighstock.src'

import { run } from '../utils/scriptEnv'


export default class PriceChart extends Component {

  dataChanged = (nextProps) => {
    let dataChanged = this.props.config.series[0].name !== nextProps.config.series[0].name
      || this.props.config.series[0].data.length !== nextProps.config.series[0].data.length
    return dataChanged
  }

  testDataChanged = (nextProps) => {
    let testDataChanged = JSON.stringify(this.props.config.xAxis.plotLines) !== JSON.stringify(nextProps.config.xAxis.plotLines)
      || this.props.config.xAxis.plotLines.length !== this.props.config.xAxis.plotLines.length
    return testDataChanged
  }

  shouldComponentUpdate = (nextProps, nextState) => (
    this.props.config.series[0].name !== nextProps.config.series[0].name
  )

  componentWillReceiveProps = (nextProps) => {
    let chart = this.refs.chart.getChart();
    if (this.dataChanged(nextProps)) {
      for(let script of nextProps.scripts){
        if(script.live && nextProps.profile.live){
          run(script.script, nextProps.chart.products, nextProps.profile, nextProps.appendLog, nextProps.updateAccounts)
        }
      }
      for(let i = 0 ; i < chart.series.length; i++){
        if(nextProps.config.series[i]){
            chart.series[i].setData(nextProps.config.series[i].data)
        }
      }
    }

    if(this.testDataChanged(nextProps)){
      console.log(nextProps.config.xAxis.plotLines)
      chart.xAxis[0].removePlotLine('testResult')
      for(let plotLine of nextProps.config.xAxis.plotLines){
        chart.xAxis[0].addPlotLine(plotLine)
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
