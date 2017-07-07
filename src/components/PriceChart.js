import React, { Component } from 'react'
import ReactHighstock from 'react-highcharts/ReactHighstock.src'


export default class PriceChart extends Component {

  shouldComponentUpdate = (nextProps, nextState) => {
    let startDateChanged = nextProps.dateRange.startDate !== this.props.dateRange.startDate
    let endDateChanged = nextProps.dateRange.endDate !== this.props.dateRange.endDate
    let dataLengthChanged = this.props.config.series[0].data.length !== nextProps.config.series[0].data.length
    return startDateChanged ||  endDateChanged || dataLengthChanged
  }

  componentWillReceiveProps() {
    let chart = this.refs.chart.getChart();
    //console.log(chart)
    //setData (Array data, [Boolean redraw], [Mixed animation], [Boolean updatePoints])
    for(let i = 0 ; i < chart.series.length; i++){
      if (this.props.config.series[i]) {
    //    chart.series[i].setData(this.props.config.series[i].data)
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
