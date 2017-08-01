import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts/ReactHighstock.src';
import PropTypes from 'prop-types';


export default class PriceChart extends Component {

  componentWillReceiveProps = (nextProps) => {
    const chart = this.wschart.getChart();
    if (this.dataChanged(nextProps)) {
      for (let i = 0; i < chart.series.length; i += 1) {
        if (nextProps.config.series[i]) {
          chart.series[i].update({
            name: nextProps.config.series[i].name,
            data: nextProps.config.series[i].data,
          });
        }
      }
    }
  }

  shouldComponentUpdate = nextProps => (false)

  dataChanged = (nextProps) => {
    for (let i = 0; i < nextProps.config.series.length; i += 1) {
      if (this.props.config.series[i]) {
        // if start data, last data, or name is not equal to previous
        const lastIndex = this.props.config.series[i].data.length - 1;
        const earliestDataChanged = JSON.stringify(this.props.config.series[i].data[0])
          !== JSON.stringify(nextProps.config.series[i].data[0]);
        const latestDataChanged = JSON.stringify(this.props.config.series[i].data[lastIndex])
          !== JSON.stringify(nextProps.config.series[i].data[lastIndex]);
        const nameChanged = JSON.stringify(this.props.config.series[i].name)
          !== JSON.stringify(nextProps.config.series[i].name);
        if (earliestDataChanged || latestDataChanged || nameChanged) {
          return true;
        }
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

PriceChart.propTypes = {
  config: PropTypes.object.isRequired,
};
