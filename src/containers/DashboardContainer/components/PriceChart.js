import React, { Component } from 'react'
import ReactHighstock from 'react-highcharts/ReactHighstock.src'


export default class PriceChart extends Component {

  shouldComponentUpdate = (nextProps, nextState) => {
    let startDateChanged = nextProps.dateRange.startDate !== this.props.dateRange.startDate
    let endDateChanged = nextProps.dateRange.endDate !== this.props.dateRange.endDate
    let dataLengthChanged = this.props.config.series[0].data.length !== nextProps.config.series[0].data.length
    return startDateChanged ||  endDateChanged || dataLengthChanged
  }

  render() {
    return (
      <div style={{width: 897,height: 470}}>
        <ReactHighstock config={this.props.config} />
      </div>
    )
  }
}
