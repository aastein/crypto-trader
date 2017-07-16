import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts/ReactHighstock.src';


export default class PriceChart extends Component {

  componentWillReceiveProps = (nextProps) => {
    const chart = this.wschart.getChart();
    if (this.dataChanged(nextProps)) {
      for (let i = 0; i < chart.series.length; i += 1) {
        if (nextProps.config.series[i]) {
          chart.series[i].setData(nextProps.config.series[i].data);
        }
      }
    }
  }

  shouldComponentUpdate = nextProps => (this.dataChanged(nextProps))

  dataChanged = (nextProps) => {
    for (let i = 0; i < nextProps.config.series.length; i += 1) {
      if (this.props.config.series[i]) {
        // if start or last data is not equal to previous
        const lastIndex = this.props.config.series[i].data.length - 1;
        const earliestDataChanged = JSON.stringify(this.props.config.series[i].data[0])
          !== JSON.stringify(nextProps.config.series[i].data[0]);
        const latestDataChanged = JSON.stringify(this.props.config.series[i].data[lastIndex])
          !== JSON.stringify(nextProps.config.series[i].data[lastIndex]);
        return earliestDataChanged || latestDataChanged;
      }
    }
    return false;
  }

  render() {
    return (
      <div className="line-chart" >
        <ReactHighcharts config={this.props.config} ref={(c) => { this.wschart = c; }} />
      </div>
    );
  }
}
