import React, { Component } from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock.src';
import PropTypes from 'prop-types';

export default class PriceChart extends Component {

  componentWillReceiveProps = (nextProps) => {
    const chart = this.chart.getChart();
    if (this.dataChanged(nextProps)) {
      for (let i = 0; i < chart.series.length; i += 1) {
        if (nextProps.config.series[i]) {
          chart.series[i].setData(nextProps.config.series[i].data);
        }
      }
    }

    if (this.testDataChanged(nextProps)) {
      chart.xAxis[0].removePlotLine('testResult');
      for (let i = 0; i < nextProps.config.xAxis.plotLines.length; i += 1) {
        chart.xAxis[0].addPlotLine(nextProps.config.xAxis.plotLines[i]);
      }
    }
  }

  shouldComponentUpdate = nextProps => (
    this.props.config.series[0].name !== nextProps.config.series[0].name
  )

  dataChanged = nextProps => (
    this.props.config.series[0].name !== nextProps.config.series[0].name
      || this.props.config.series[0].data.length !== nextProps.config.series[0].data.length
  )

  testDataChanged = nextProps => (
    JSON.stringify(this.props.config.xAxis.plotLines)
    !== JSON.stringify(nextProps.config.xAxis.plotLines)
      || this.props.config.xAxis.plotLines.length !== nextProps.config.xAxis.plotLines.length
  )

  render() {
    return (
      <div className="price-chart chart">
        <ReactHighstock config={this.props.config} ref={(c) => { this.chart = c; }} />
      </div>
    );
  }
}


PriceChart.propTypes = {
  config: PropTypes.object.isRequired,
};
